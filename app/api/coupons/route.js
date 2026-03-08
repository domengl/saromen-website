import { NextResponse } from "next/server";
import { getCoupons } from "@/lib/store";

export async function GET() {
  const items = await getCoupons();
  return NextResponse.json({ items });
}
