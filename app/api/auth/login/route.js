import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createUserSessionCookie } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const email = parsed.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Napacni prijavni podatki." }, { status: 401 });
    }

    const valid = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ message: "Napacni prijavni podatki." }, { status: 401 });
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


