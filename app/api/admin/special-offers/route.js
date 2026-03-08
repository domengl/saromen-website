import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { z } from "zod";
import { isAdminRequest } from "@/lib/admin";
import { getSpecialOffersFromGoogleSheets, upsertSpecialOfferToGoogleSheets } from "@/lib/google-sync";

const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  description: z.string().optional(),
  percent: z.number().int().min(1).max(80),
  active: z.boolean().optional(),
  startAt: z.string().optional(),
  endAt: z.string().optional()
});

export async function GET(request) {
  const isAdmin = await isAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ message: "Admin dostop potreben." }, { status: 403 });
  }

  try {
    const items = await getSpecialOffersFromGoogleSheets({ onlyActive: false });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request) {
  const isAdmin = await isAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ message: "Admin dostop potreben." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const id = parsed.id?.trim() || `offer-${Date.now()}`;

    await upsertSpecialOfferToGoogleSheets({
      id,
      title: parsed.title,
      description: parsed.description || "",
      percent: parsed.percent,
      active: parsed.active !== false,
      startAt: parsed.startAt || "",
      endAt: parsed.endAt || ""
    });

    return NextResponse.json({
      item: {
        id,
        title: parsed.title,
        description: parsed.description || "",
        percent: parsed.percent,
        active: parsed.active !== false,
        startAt: parsed.startAt || "",
        endAt: parsed.endAt || ""
      }
    });
  } catch {
    return NextResponse.json({ message: "Shranjevanje posebne ugodnosti ni uspelo." }, { status: 400 });
  }
}
