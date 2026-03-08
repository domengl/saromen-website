import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashVoucherCode, validateSignedVoucherCode } from "@/lib/vouchers";

const schema = z.object({
  code: z.string().min(8)
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const codeHash = hashVoucherCode(parsed.code);

    try {
      const voucher = await prisma.giftVoucher.findUnique({
        where: { codeHash }
      });

      if (!voucher || voucher.status !== "ACTIVE" || voucher.redeemedAt) {
        const signed = validateSignedVoucherCode(parsed.code);
        if (!signed) {
          return NextResponse.json({ valid: false }, { status: 404 });
        }
        return NextResponse.json({ valid: true, amount: signed.amount, signed: true });
      }

      return NextResponse.json({ valid: true, amount: voucher.amount });
    } catch {
      const signed = validateSignedVoucherCode(parsed.code);
      if (!signed) {
        return NextResponse.json({ valid: false }, { status: 404 });
      }
      return NextResponse.json({ valid: true, amount: signed.amount, signed: true });
    }
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
