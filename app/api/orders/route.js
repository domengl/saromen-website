import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";

export async function GET(request) {
  const session = await getUserSession(request);
  if (!session?.userId) {
    return NextResponse.json({ items: [] });
  }

  try {
    const items = await prisma.order.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 30
    });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}


