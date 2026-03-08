import { createHash, randomBytes } from "crypto";

const DEFAULT_SECRET = "saromen-voucher-secret-change-me";

function getSecret() {
  return process.env.VOUCHER_SECRET || DEFAULT_SECRET;
}

export function hashVoucherCode(code) {
  return createHash("sha256")
    .update(`${getSecret()}::${String(code || "").trim().toUpperCase()}`)
    .digest("hex");
}

export function generateVoucherCode() {
  const partA = randomBytes(3).toString("hex").toUpperCase();
  const partB = randomBytes(3).toString("hex").toUpperCase();
  const partC = Date.now().toString(36).slice(-6).toUpperCase();
  return `SAR-${partA}-${partB}-${partC}`;
}

export function createSignedVoucherCode(amount) {
  const cents = Math.max(0, Math.round(Number(amount || 0) * 100));
  const nonce = randomBytes(2).toString("hex").toUpperCase();
  const issued = Date.now().toString(36).toUpperCase();
  const payload = `${cents}-${issued}-${nonce}`;
  const signature = createHash("sha256").update(`${getSecret()}::SIGNED::${payload}`).digest("hex").slice(0, 12).toUpperCase();
  return `GFT-${payload}-${signature}`;
}

export function validateSignedVoucherCode(code) {
  const value = String(code || "").trim().toUpperCase();
  const parts = value.split("-");
  if (parts.length !== 5 || parts[0] !== "GFT") return null;

  const payload = [parts[1], parts[2], parts[3]].join("-");
  const signature = parts[4];
  const expected = createHash("sha256").update(`${getSecret()}::SIGNED::${payload}`).digest("hex").slice(0, 12).toUpperCase();
  if (signature !== expected) return null;

  const cents = Number(parts[1]);
  if (!Number.isFinite(cents) || cents <= 0) return null;
  return { amount: cents / 100 };
}
