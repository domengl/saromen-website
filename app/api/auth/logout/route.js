import { NextResponse } from "next/server";
import { clearUserSessionCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const cookie = clearUserSessionCookie();
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
