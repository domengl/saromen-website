import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { getSpecialOffersFromGoogleSheets } from "@/lib/google-sync";

export async function GET() {
  try {
    const items = await getSpecialOffersFromGoogleSheets({ onlyActive: true });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
