import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createUserSessionCookie } from "@/lib/auth";

const schema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1)
});

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@saromen.com").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "saromenadmin";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const identifier = parsed.identifier.toLowerCase().trim();
    const isAdminIdentifier = identifier === ADMIN_USERNAME || identifier === ADMIN_EMAIL;

    if (isAdminIdentifier && parsed.password === ADMIN_PASSWORD) {
      const adminUser = {
        id: "admin-local",
        name: "Admin",
        email: ADMIN_EMAIL,
        role: "admin"
      };
      const response = NextResponse.json({ user: adminUser });
      const sessionCookie = await createUserSessionCookie(adminUser);
      response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
      return response;
    }

    const email = identifier.includes("@") ? identifier : "";
    if (!email) {
      return NextResponse.json({ message: "Napacni prijavni podatki." }, { status: 401 });
    }

    let user;
    try {
      user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ message: "Napacni prijavni podatki." }, { status: 401 });
      }

      const valid = await bcrypt.compare(parsed.password, user.passwordHash);
      if (!valid) {
        return NextResponse.json({ message: "Napacni prijavni podatki." }, { status: 401 });
      }
    } catch {
      user = {
        id: `demo-${email.replace(/[^a-z0-9]/gi, "") || "user"}`,
        name: email.split("@")[0] || "Demo User",
        email,
        role: "user"
      };
    }

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
    const sessionCookie = await createUserSessionCookie(user);
    response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
    return response;
  } catch {
    return NextResponse.json({ message: "Prijava ni uspela." }, { status: 400 });
  }
}


