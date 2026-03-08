import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import Stripe from "stripe";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCoupons } from "@/lib/store";
import { getUserSession } from "@/lib/auth";
import { sendOrderEmail } from "@/lib/email";
import { hashVoucherCode, validateSignedVoucherCode } from "@/lib/vouchers";

const schema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().nullable().optional(),
        name: z.string().min(1),
        scent: z.string().default(""),
        quantity: z.number().int().min(1),
        unitPrice: z.number().positive(),
        preorder: z.boolean().optional(),
        etaDays: z.number().int().min(1).optional(),
        note: z.string().optional()
      })
    )
    .min(1),
  couponCode: z.string().nullable().optional(),
  voucherCode: z.string().nullable().optional(),
  customerEmail: z.string().email()
});

function toCents(value) {
  return Math.round(Number(value) * 100);
}

function randomCode(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const subtotal = parsed.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const coupons = await getCoupons();
    const coupon = parsed.couponCode ? coupons.find((item) => item.code === parsed.couponCode && item.active !== false) : null;
    const voucherCode = parsed.voucherCode ? String(parsed.voucherCode).trim().toUpperCase() : null;

    let couponDiscount = 0;
    if (coupon && subtotal >= Number(coupon.minAmount || 0)) {
      couponDiscount = subtotal * (Number(coupon.percent || 0) / 100);
    }

    let voucher = null;
    let voucherDiscount = 0;
    if (voucherCode) {
      try {
        voucher = await prisma.giftVoucher.findUnique({
          where: { codeHash: hashVoucherCode(voucherCode) }
        });
      } catch {
        voucher = null;
      }
      if (voucher && voucher.status === "ACTIVE" && !voucher.redeemedAt) {
        voucherDiscount = Math.min(Math.max(0, subtotal - couponDiscount), Number(voucher.amount || 0));
      } else {
        const signed = validateSignedVoucherCode(voucherCode);
        if (!signed) {
          return NextResponse.json({ message: "Darilni bon ni veljaven." }, { status: 400 });
        }
        voucherDiscount = Math.min(Math.max(0, subtotal - couponDiscount), Number(signed.amount || 0));
      }
    }

    const discount = couponDiscount + voucherDiscount;
    const afterDiscount = Math.max(0, subtotal - discount);
    const shipping = afterDiscount === 0 ? 0 : afterDiscount >= 50 ? 0 : 4.9;
    const total = afterDiscount + shipping;

    const now = Date.now();
    const orderNumber = randomCode("SAR");
    const invoiceNumber = randomCode("INV");
    const trackingNumber = randomCode("TRK");
    const session = await getUserSession(request);

    let dbOrder = null;
    try {
      dbOrder = await prisma.order.create({
        data: {
          orderNumber,
          invoiceNumber,
          trackingNumber,
          status: "PENDING",
          subtotal,
          discount,
          shipping,
          total,
          customerEmail: parsed.customerEmail,
          userId: session?.userId || null,
          items: {
            create: parsed.items.map((item) => ({
              productId: item.productId || null,
              name: item.name,
              scent: item.scent,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              preorder: Boolean(item.preorder),
              etaDays: item.etaDays || 1,
              note: item.note || null
            }))
          }
        }
      });
    } catch {
      dbOrder = null;
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (voucher && dbOrder) {
      await prisma.giftVoucher.updateMany({
        where: { id: voucher.id, redeemedAt: null, status: "ACTIVE" },
        data: { status: "REDEEMED", redeemedAt: new Date(), redeemedOrderNumber: orderNumber }
      });
    }

    if (stripeKey) {
      const stripe = new Stripe(stripeKey);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const discountFactor = subtotal > 0 ? afterDiscount / subtotal : 1;

      const lineItems = parsed.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: toCents(item.unitPrice * discountFactor),
          product_data: {
            name: item.name,
            description: `${item.scent}${item.preorder ? ` / Prednarocilo (${item.etaDays || 1} dni)` : ""}${
              coupon ? ` / Kupon ${coupon.code}` : ""
            }`
          }
        }
      }));

      if (shipping > 0) {
        lineItems.push({
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: toCents(shipping),
            product_data: { name: "Postnina", description: "Standard dostava" }
          }
        });
      }

      const stripeSession = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: parsed.customerEmail,
        line_items: lineItems,
        success_url: `${siteUrl}/profile?checkout=success&order=${orderNumber}`,
        cancel_url: `${siteUrl}/?checkout=cancel`,
        metadata: { orderNumber }
      });

      if (dbOrder) {
        await prisma.order.update({
          where: { id: dbOrder.id },
          data: { stripeSession: stripeSession.id }
        });
      }

      return NextResponse.json({
        checkoutUrl: stripeSession.url,
        orderNumber,
        invoiceNumber,
        trackingNumber
      });
    }

    await sendOrderEmail({
      to: parsed.customerEmail,
      subject: `SAROMEN narocilo ${orderNumber}`,
      html: `<p>Hvala za narocilo.</p><p>Racun: ${invoiceNumber}</p><p>Tracking: ${trackingNumber}</p><p>Skupaj: ${total.toFixed(
        2
      )} EUR</p>`
    });

    if (dbOrder) {
      await prisma.order.update({ where: { id: dbOrder.id }, data: { status: "PAID" } });
    }

    return NextResponse.json({
      demo: true,
      orderNumber,
      invoiceNumber,
      trackingNumber,
      total,
      createdAt: now
    });
  } catch {
    return NextResponse.json({ message: "Checkout ni uspel." }, { status: 400 });
  }
}


