import { prisma } from "@/lib/prisma";
import { seedCoupons, seedProducts } from "@/lib/seed-data";

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
    let products = await prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
    if (products.length === 0) {
      for (const item of seedProducts) {
        await prisma.product.upsert({
          where: { slug: item.slug },
          update: item,
          create: item
        });
      }
      products = await prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
    }
    return products;
  } catch {
    return fallbackProducts();
  }
}

export async function getCoupons() {
  try {
    let coupons = await prisma.coupon.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
    if (coupons.length === 0) {
      for (const item of seedCoupons) {
        await prisma.coupon.upsert({
          where: { code: item.code },
          update: item,
          create: item
        });
      }
      coupons = await prisma.coupon.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
    }
    return coupons;
  } catch {
    return fallbackCoupons();
  }
}
