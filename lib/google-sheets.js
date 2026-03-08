import { createPrivateKey } from "crypto";
import { SignJWT } from "jose";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "";
const TOKEN_AUDIENCE = "https://oauth2.googleapis.com/token";
const TOKEN_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

let tokenCache = { value: "", expiresAt: 0 };

function normalizePrivateKey(value) {
  if (!value) return "";
  return value.replace(/\\n/g, "\n");
}

function getServiceAccountConfig() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      return {
        clientEmail: parsed.client_email || "",
        privateKey: normalizePrivateKey(parsed.private_key || "")
      };
    } catch {
      return { clientEmail: "", privateKey: "" };
    }
  }

  return {
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
    privateKey: normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "")
  };
}

export function isGoogleSheetsConfigured() {
  const svc = getServiceAccountConfig();
  return Boolean(SPREADSHEET_ID && svc.clientEmail && svc.privateKey);
}

function getSpreadsheetId() {
  if (!SPREADSHEET_ID) {
    throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID missing.");
  }
  return SPREADSHEET_ID;
}

async function getAccessToken() {
  const nowMs = Date.now();
  if (tokenCache.value && tokenCache.expiresAt > nowMs + 30000) {
    return tokenCache.value;
  }

  const { clientEmail, privateKey } = getServiceAccountConfig();
  if (!clientEmail || !privateKey) {
    throw new Error("Google service account credentials are missing.");
  }

  const nowSec = Math.floor(nowMs / 1000);
  const key = createPrivateKey({ key: privateKey, format: "pem" });

  const assertion = await new SignJWT({
    iss: clientEmail,
    scope: TOKEN_SCOPE,
    aud: TOKEN_AUDIENCE
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt(nowSec)
    .setExpirationTime(nowSec + 3600)
    .sign(key);

  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion
  });

  const response = await fetch(TOKEN_AUDIENCE, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch Google access token: ${text}`);
  }

  const json = await response.json();
  tokenCache = {
    value: json.access_token,
    expiresAt: nowMs + Number(json.expires_in || 3600) * 1000
  };
  return tokenCache.value;
}

function columnName(index1Based) {
  let index = Number(index1Based || 1);
  let result = "";
  while (index > 0) {
    const rem = (index - 1) % 26;
    result = String.fromCharCode(65 + rem) + result;
    index = Math.floor((index - 1) / 26);
  }
  return result || "A";
}

async function sheetsRequest(path, { method = "GET", body } = {}) {
  const token = await getAccessToken();
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${getSpreadsheetId()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Sheets API request failed: ${text}`);
  }

  if (response.status === 204) return {};
  return response.json();
}

export async function getRangeValues(range) {
  const encoded = encodeURIComponent(range);
  const json = await sheetsRequest(`/values/${encoded}`);
  return json.values || [];
}

export async function updateRangeValues(range, values) {
  const encoded = encodeURIComponent(range);
  return sheetsRequest(`/values/${encoded}?valueInputOption=USER_ENTERED`, {
    method: "PUT",
    body: { values }
  });
}

export async function appendRangeValues(range, values) {
  const encoded = encodeURIComponent(range);
  return sheetsRequest(`/values/${encoded}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    body: { values }
  });
}

export async function ensureHeaders(sheetName, headers) {
  const first = await getRangeValues(`${sheetName}!1:1`);
  const existing = first[0] || [];
  if (!existing.length) {
    await updateRangeValues(`${sheetName}!A1:${columnName(headers.length)}1`, [headers]);
    return headers;
  }

  const merged = [...existing];
  for (const header of headers) {
    if (!merged.includes(header)) merged.push(header);
  }

  if (merged.length !== existing.length) {
    await updateRangeValues(`${sheetName}!A1:${columnName(merged.length)}1`, [merged]);
  }

  return merged;
}

export async function readSheetObjects(sheetName) {
  const values = await getRangeValues(`${sheetName}!A1:ZZ5000`);
  if (!values.length) return [];
  const headers = values[0].map((h) => String(h || "").trim());
  const rows = values.slice(1);

  return rows
    .filter((row) => row.some((cell) => String(cell || "").trim() !== ""))
    .map((row, index) => {
      const obj = { _row: index + 2 };
      headers.forEach((header, columnIndex) => {
        if (!header) return;
        obj[header] = row[columnIndex] ?? "";
      });
      return obj;
    });
}

function mapRow(headers, data) {
  return headers.map((header) => {
    const value = data[header];
    if (value === undefined || value === null) return "";
    return String(value);
  });
}

export async function appendObject(sheetName, data, requiredHeaders) {
  const headers = await ensureHeaders(sheetName, requiredHeaders);
  await appendRangeValues(`${sheetName}!A1`, [mapRow(headers, data)]);
}

export async function upsertObject(sheetName, keyHeader, keyValue, data, requiredHeaders) {
  const headers = await ensureHeaders(sheetName, requiredHeaders);
  const rows = await readSheetObjects(sheetName);
  const target = rows.find((row) => String(row[keyHeader] || "") === String(keyValue || ""));
  const rowValues = mapRow(headers, data);

  if (target?._row) {
    await updateRangeValues(
      `${sheetName}!A${target._row}:${columnName(headers.length)}${target._row}`,
      [rowValues]
    );
    return;
  }

  await appendRangeValues(`${sheetName}!A1`, [rowValues]);
}

export async function patchObject(sheetName, keyHeader, keyValue, patch, requiredHeaders = []) {
  const headers = await ensureHeaders(sheetName, [keyHeader, ...requiredHeaders, ...Object.keys(patch)]);
  const rows = await readSheetObjects(sheetName);
  const target = rows.find((row) => String(row[keyHeader] || "") === String(keyValue || ""));
  if (!target?._row) return false;

  const merged = {};
  headers.forEach((header) => {
    merged[header] = target[header] ?? "";
  });
  Object.assign(merged, patch);

  await updateRangeValues(
    `${sheetName}!A${target._row}:${columnName(headers.length)}${target._row}`,
    [mapRow(headers, merged)]
  );
  return true;
}
