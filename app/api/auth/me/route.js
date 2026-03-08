import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";

export async function GET(request) {
  const session = await getUserSession(request);
  if (!session?.userId) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, role: true }
    });
    if (user) {
      return NextResponse.json({ user });
    }
    return NextResponse.json({
      user: {
        id: session.userId,
        name: session.name || "Demo User",
        email: session.email || "",
        role: session.role || "user"
      }
    });
  } catch {
    return NextResponse.json({
      user: {
        id: session.userId,
        name: session.name || "Demo User",
        email: session.email || "",
        role: session.role || "user"
      }
    });
  }
}


