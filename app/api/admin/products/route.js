import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/admin";
import { getProducts } from "@/lib/store";

const schema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  scent: z.string().min(2),
  description: z.string().min(3),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  etaDays: z.number().int().min(1),
  salePercent: z.number().int().min(0).max(80),
  isTop: z.boolean().optional(),
  isNew: z.boolean().optional()
});

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const items = await getProducts();
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
    const slug = `${slugify(parsed.name)}-${Date.now()}`;

    const item = await prisma.product.create({
      data: {
        slug,
        name: parsed.name,
        category: parsed.category,
        scent: parsed.scent,
        description: parsed.description,
        price: parsed.price,
        stock: parsed.stock,
        etaDays: parsed.etaDays,
        salePercent: parsed.salePercent,
        isTop: Boolean(parsed.isTop),
        isNew: Boolean(parsed.isNew),
        active: true
      }
    });

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ message: "Dodajanje izdelka ni uspelo." }, { status: 400 });
  }
}


