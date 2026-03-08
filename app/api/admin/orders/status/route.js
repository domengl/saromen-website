import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/admin";
import { updateOrderStatusInGoogleSheets } from "@/lib/google-sync";

const schema = z.object({
  orderNumber: z.string().min(3),
  status: z.enum(["PENDING", "PAID", "FAILED", "SHIPPED", "DELIVERED"]),
  note: z.string().optional()
});

export async function POST(request) {
  const isAdmin = await isAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ message: "Admin dostop potreben." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    try {
      await prisma.order.update({
        where: { orderNumber: parsed.orderNumber },
        data: { status: parsed.status === "SHIPPED" || parsed.status === "DELIVERED" ? "PAID" : parsed.status }
      });
    } catch {}

    await updateOrderStatusInGoogleSheets({
      orderNumber: parsed.orderNumber,
      status: parsed.status,
      note: parsed.note || ""
    }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Posodobitev statusa ni uspela." }, { status: 400 });
  }
}
