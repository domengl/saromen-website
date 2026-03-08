import { NextResponse } from "next/server";
import { getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getProducts();
  return NextResponse.json({ items });
}

