import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "saromen_session";
const ADMIN_COOKIE = "saromen_admin";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "saromen-dev-secret-change-me");

async function sign(payload, expiresIn = "7d") {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(expiresIn).sign(secret);
}

async function verify(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function createUserSessionCookie(user) {
  const token = await sign({ userId: user.id, email: user.email, name: user.name || "Uporabnik", role: user.role || "user" });
  return { name: SESSION_COOKIE, value: token, options: { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 } };
}

export function clearUserSessionCookie() {
  return { name: SESSION_COOKIE, value: "", options: { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 } };
}

export async function createAdminSessionCookie() {
  const token = await sign({ admin: true }, "12h");
  return { name: ADMIN_COOKIE, value: token, options: { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 } };
}

export function clearAdminSessionCookie() {
  return { name: ADMIN_COOKIE, value: "", options: { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 } };
}

export async function getUserSession(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verify(token);
}

export async function getAdminSession(request) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return verify(token);
}
