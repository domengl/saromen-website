import { prisma } from "@/lib/prisma";
import { seedCoupons, seedProducts } from "@/lib/seed-data";
import {
  getCouponsFromGoogleSheets,
  getProductsFromGoogleSheets,
  syncCouponsToGoogleSheets,
  syncProductsToGoogleSheets
} from "@/lib/google-sync";

function fallbackProducts() {
  return seedProducts.map((item, index) => ({
    id: `seed-${index + 1}`,
    ...item,
    active: true
  }));
}

function fallbackCoupons() {
  return seedCoupons.map((item, index) => ({
    id: `coupon-seed-${index + 1}`,
    ...item,
    active: true
  }));
}

export async function getProducts() {
  try {
    const sheetProducts = await getProductsFromGoogleSheets();
    if (sheetProducts.length > 0) {
      return sheetProducts;
    }
  } catch {}

  try {
    for (const item of seedProducts) {
      await prisma.product.upsert({
        where: { slug: item.slug },
        update: {},
        create: item
      });
    }
    const products = await prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
    try {
      await syncProductsToGoogleSheets(products);
    } catch {}
    return products;
  } catch {
    return fallbackProducts();
  }
}

export async function getCoupons() {
  try {
    const sheetCoupons = await getCouponsFromGoogleSheets();
    if (sheetCoupons.length > 0) {
      return sheetCoupons;
    }
  } catch {}

  try {
    for (const item of seedCoupons) {
      await prisma.coupon.upsert({
        where: { code: item.code },
        update: {},
        create: item
      });
    }
    const coupons = await prisma.coupon.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
    try {
      await syncCouponsToGoogleSheets(coupons);
    } catch {}
    return coupons;
  } catch {
    return fallbackCoupons();
  }
}
