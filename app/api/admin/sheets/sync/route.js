import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { isAdminRequest } from "@/lib/admin";
import { getCoupons, getProducts } from "@/lib/store";
import { syncCouponsToGoogleSheets, syncProductsToGoogleSheets } from "@/lib/google-sync";

export async function POST(request) {
  const isAdmin = await isAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ message: "Admin dostop potreben." }, { status: 403 });
  }

  try {
    const [products, coupons] = await Promise.all([getProducts(), getCoupons()]);
    await syncProductsToGoogleSheets(products);
    await syncCouponsToGoogleSheets(coupons);
    return NextResponse.json({ ok: true, products: products.length, coupons: coupons.length });
  } catch {
    return NextResponse.json({ message: "Sheets sync ni uspel." }, { status: 400 });
  }
}
