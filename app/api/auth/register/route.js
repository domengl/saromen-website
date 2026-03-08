import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createUserSessionCookie } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const email = parsed.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Profil s tem emailom ze obstaja." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.password, 10);
    const user = await prisma.user.create({
      data: { name: parsed.name.trim(), email, passwordHash }
    });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
    const sessionCookie = await createUserSessionCookie(user);
    response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
    return response;
  } catch {
    return NextResponse.json({ message: "Registracija ni uspela." }, { status: 400 });
  }
}
