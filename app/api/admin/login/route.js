import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { createAdminSessionCookie, getAdminSession } from "@/lib/auth";

const USERNAME = process.env.ADMIN_USERNAME || "admin";
const PASSWORD = process.env.ADMIN_PASSWORD || "saromenadmin";

export async function GET(request) {
  const session = await getAdminSession(request);
  return NextResponse.json({ admin: Boolean(session?.admin) });
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (body.username !== USERNAME || body.password !== PASSWORD) {
      return NextResponse.json({ message: "Napacni admin podatki." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    const cookie = await createAdminSessionCookie();
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch {
    return NextResponse.json({ message: "Admin prijava ni uspela." }, { status: 400 });
  }
}


