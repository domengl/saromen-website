const AUTH_USERNAME = "saradomen";
const AUTH_PASSWORD = "saradomen";
const AUTH_COOKIE_NAME = "saromen_auth";
const AUTH_COOKIE_VALUE = "saromen_private_access_v1";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

async function getJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  const raw = await readBody(req);
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Method not allowed." });
  }

  const body = await getJsonBody(req);
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (username !== AUTH_USERNAME || password !== AUTH_PASSWORD) {
    return res.status(401).json({ ok: false, message: "Nepravilno uporabnisko ime ali geslo." });
  }

  const cookie = [
    `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}`
  ].join("; ");

  res.setHeader("Set-Cookie", cookie);
  return res.status(200).json({ ok: true });
};
