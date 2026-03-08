import { NextResponse } from "next/server";
import { getProducts } from "@/lib/store";

export async function GET() {
  const items = await getProducts();
  return NextResponse.json({ items });
}
