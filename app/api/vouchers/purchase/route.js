import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSignedVoucherCode, generateVoucherCode, hashVoucherCode } from "@/lib/vouchers";
import { sendOrderEmail } from "@/lib/email";

const schema = z.object({
  amount: z.number().min(10).max(1000),
  recipientEmail: z.string().email(),
  recipientName: z.string().optional(),
  purchaserEmail: z.string().email().optional()
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    let code = generateVoucherCode();
    const recipientEmail = parsed.recipientEmail.toLowerCase().trim();
    const recipientName = parsed.recipientName?.trim() || null;
    const purchaserEmail = parsed.purchaserEmail?.toLowerCase().trim() || null;

    try {
      await prisma.giftVoucher.create({
        data: {
          codeHash: hashVoucherCode(code),
          amount: parsed.amount,
          recipientEmail,
          recipientName,
          purchaserEmail,
          status: "ACTIVE"
        }
      });
    } catch {
      code = createSignedVoucherCode(parsed.amount);
    }

    const displayRecipient = recipientName || "Prejemnik";
    const emailResult = await sendOrderEmail({
      to: parsed.recipientEmail,
      subject: `SAROMEN darilni bon (${parsed.amount} EUR)`,
      html: `<h2>Darilni bon SAROMEN</h2><p>Pozdravljeni ${displayRecipient},</p><p>prejeli ste darilni bon v vrednosti <strong>${parsed.amount.toFixed(
        2
      )} EUR</strong> za trgovino SAROMEN.</p><p>Unikatna koda bona:</p><p style="font-size:22px;font-weight:700;letter-spacing:2px">${code}</p><p>Kodo vnesite v kosarici v polje kupon/darilni bon.</p>`
    });

    return NextResponse.json({ ok: true, code: emailResult.ok ? null : code, emailSent: Boolean(emailResult.ok) });
  } catch {
    return NextResponse.json({ message: "Nakup darilnega bona ni uspel." }, { status: 400 });
  }
}
