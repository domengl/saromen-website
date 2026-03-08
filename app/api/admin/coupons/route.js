import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/admin";
import { getCoupons } from "@/lib/store";

const schema = z.object({
  code: z.string().min(3),
  percent: z.number().int().min(1).max(80),
  minAmount: z.number().min(0)
});

export async function GET() {
  const items = await getCoupons();
  return NextResponse.json({ items });
}

export async function POST(request) {
  const isAdmin = await isAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ message: "Admin dostop potreben." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const code = parsed.code.trim().toUpperCase();

    const item = await prisma.coupon.upsert({
      where: { code },
      update: { percent: parsed.percent, minAmount: parsed.minAmount, active: true },
      create: { code, percent: parsed.percent, minAmount: parsed.minAmount, active: true }
    });

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ message: "Dodajanje kupona ni uspelo." }, { status: 400 });
  }
}
