import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const cookie = clearAdminSessionCookie();
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
