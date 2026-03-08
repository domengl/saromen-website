import {
  appendObject,
  isGoogleSheetsConfigured,
  patchObject,
  readSheetObjects,
  upsertObject
} from "@/lib/google-sheets";

const TABS = {
  orders: process.env.GSHEET_TAB_ORDERS || "Orders",
  inventory: process.env.GSHEET_TAB_INVENTORY || "Inventory",
  capacity: process.env.GSHEET_TAB_CAPACITY || "Capacity",
  products: process.env.GSHEET_TAB_PRODUCTS || "Products",
  coupons: process.env.GSHEET_TAB_COUPONS || "Coupons",
  offers: process.env.GSHEET_TAB_SPECIAL_OFFERS || "SpecialOffers"
};

const PRODUCT_HEADERS = [
  "slug",
  "name",
  "category",
  "scent",
  "description",
  "price",
  "stock",
  "etaDays",
  "salePercent",
  "isTop",
  "isNew",
  "active",
  "updatedAt"
];

const COUPON_HEADERS = ["code", "percent", "minAmount", "active", "updatedAt"];
const OFFER_HEADERS = ["id", "title", "description", "percent", "active", "startAt", "endAt", "updatedAt"];
const ORDER_HEADERS = [
  "orderNumber",
  "createdAt",
  "status",
  "customerEmail",
  "subtotal",
  "discount",
  "shipping",
  "total",
  "couponCode",
  "voucherCode",
  "trackingNumber",
  "invoiceNumber",
  "itemsJson",
  "updatedAt"
];
const INVENTORY_HEADERS = ["sku", "name", "currentStock", "reservedStock", "etaDays", "lastOrder", "lastUpdated"];
const CAPACITY_HEADERS = ["sku", "name", "maxPlanned", "currentReserved", "available", "lastOrder", "lastUpdated"];

function boolFromValue(value, fallback = false) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["1", "true", "yes", "da", "active"].includes(normalized)) return true;
  if (["0", "false", "no", "ne", "inactive"].includes(normalized)) return false;
  return fallback;
}

function numFromValue(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function intFromValue(value, fallback = 0) {
  return Math.round(numFromValue(value, fallback));
}

function normalizeSku(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isGoogleSyncEnabled() {
  return isGoogleSheetsConfigured();
}

function nowIso() {
  return new Date().toISOString();
}

export async function getProductsFromGoogleSheets() {
  if (!isGoogleSyncEnabled()) return [];
  const rows = await readSheetObjects(TABS.products);
  return rows
    .map((row, index) => ({
      id: `gs-${row.slug || index + 1}`,
      slug: String(row.slug || "").trim(),
      name: String(row.name || "").trim(),
      category: String(row.category || "").trim(),
      scent: String(row.scent || "").trim(),
      description: String(row.description || "").trim(),
      price: numFromValue(row.price, 0),
      stock: intFromValue(row.stock, 0),
      etaDays: intFromValue(row.etaDays, 3),
      salePercent: intFromValue(row.salePercent, 0),
      isTop: boolFromValue(row.isTop),
      isNew: boolFromValue(row.isNew),
      active: boolFromValue(row.active, true)
    }))
    .filter((item) => item.active && item.name && item.category && item.price > 0);
}

export async function upsertProductToGoogleSheets(product) {
  if (!isGoogleSyncEnabled()) return;
  const slug = String(product.slug || product.id || "").trim();
  if (!slug) return;
  const now = nowIso();
  await upsertObject(
    TABS.products,
    "slug",
    slug,
    {
      slug,
      name: product.name,
      category: product.category,
      scent: product.scent,
      description: product.description,
      price: product.price,
      stock: product.stock,
      etaDays: product.etaDays,
      salePercent: product.salePercent || 0,
      isTop: Boolean(product.isTop),
      isNew: Boolean(product.isNew),
      active: product.active !== false,
      updatedAt: now
    },
    PRODUCT_HEADERS
  );
}

export async function syncProductsToGoogleSheets(products) {
  if (!isGoogleSyncEnabled()) return;
  for (const product of products) {
    await upsertProductToGoogleSheets(product);
  }
}

export async function getCouponsFromGoogleSheets() {
  if (!isGoogleSyncEnabled()) return [];
  const rows = await readSheetObjects(TABS.coupons);
  return rows
    .map((row, index) => ({
      id: `gs-coupon-${index + 1}`,
      code: String(row.code || "").trim().toUpperCase(),
      percent: intFromValue(row.percent, 0),
      minAmount: numFromValue(row.minAmount, 0),
      active: boolFromValue(row.active, true)
    }))
    .filter((item) => item.code && item.percent > 0 && item.active);
}

export async function upsertCouponToGoogleSheets(coupon) {
  if (!isGoogleSyncEnabled()) return;
  const code = String(coupon.code || "").trim().toUpperCase();
  if (!code) return;
  await upsertObject(
    TABS.coupons,
    "code",
    code,
    {
      code,
      percent: coupon.percent,
      minAmount: coupon.minAmount,
      active: coupon.active !== false,
      updatedAt: nowIso()
    },
    COUPON_HEADERS
  );
}

export async function syncCouponsToGoogleSheets(coupons) {
  if (!isGoogleSyncEnabled()) return;
  for (const coupon of coupons) {
    await upsertCouponToGoogleSheets(coupon);
  }
}

function offerIsActive(offer) {
  if (!offer.active) return false;
  const now = Date.now();
  const start = offer.startAt ? Date.parse(offer.startAt) : null;
  const end = offer.endAt ? Date.parse(offer.endAt) : null;
  if (Number.isFinite(start) && now < start) return false;
  if (Number.isFinite(end) && now > end) return false;
  return true;
}

export async function getSpecialOffersFromGoogleSheets({ onlyActive = true } = {}) {
  if (!isGoogleSyncEnabled()) return [];
  const rows = await readSheetObjects(TABS.offers);
  const offers = rows
    .map((row, index) => ({
      id: String(row.id || `offer-${index + 1}`),
      title: String(row.title || "").trim(),
      description: String(row.description || "").trim(),
      percent: intFromValue(row.percent, 0),
      active: boolFromValue(row.active, true),
      startAt: String(row.startAt || "").trim(),
      endAt: String(row.endAt || "").trim()
    }))
    .filter((item) => item.title && item.percent > 0);

  return onlyActive ? offers.filter(offerIsActive) : offers;
}

export async function upsertSpecialOfferToGoogleSheets(offer) {
  if (!isGoogleSyncEnabled()) return;
  const id = String(offer.id || "").trim() || `offer-${Date.now()}`;
  await upsertObject(
    TABS.offers,
    "id",
    id,
    {
      id,
      title: offer.title,
      description: offer.description || "",
      percent: offer.percent,
      active: offer.active !== false,
      startAt: offer.startAt || "",
      endAt: offer.endAt || "",
      updatedAt: nowIso()
    },
    OFFER_HEADERS
  );
}

export async function appendOrderToGoogleSheets(orderPayload) {
  if (!isGoogleSyncEnabled()) return;
  await appendObject(
    TABS.orders,
    {
      orderNumber: orderPayload.orderNumber,
      createdAt: orderPayload.createdAt || nowIso(),
      status: orderPayload.status || "PENDING",
      customerEmail: orderPayload.customerEmail || "",
      subtotal: orderPayload.subtotal || 0,
      discount: orderPayload.discount || 0,
      shipping: orderPayload.shipping || 0,
      total: orderPayload.total || 0,
      couponCode: orderPayload.couponCode || "",
      voucherCode: orderPayload.voucherCode || "",
      trackingNumber: orderPayload.trackingNumber || "",
      invoiceNumber: orderPayload.invoiceNumber || "",
      itemsJson: JSON.stringify(orderPayload.items || []),
      updatedAt: nowIso()
    },
    ORDER_HEADERS
  );
}

export async function updateOrderStatusInGoogleSheets({ orderNumber, status, note = "" }) {
  if (!isGoogleSyncEnabled()) return false;
  return patchObject(
    TABS.orders,
    "orderNumber",
    orderNumber,
    {
      status,
      note,
      updatedAt: nowIso()
    },
    [...ORDER_HEADERS, "note"]
  );
}

async function adjustInventoryForItem(item, orderNumber) {
  const sku = normalizeSku(item.productSlug || item.productId || item.name);
  if (!sku) return;

  const inventoryRows = await readSheetObjects(TABS.inventory);
  const existing = inventoryRows.find((row) => normalizeSku(row.sku) === sku);
  const currentStock = intFromValue(existing?.currentStock, 0);
  const currentReserved = intFromValue(existing?.reservedStock, 0);
  const quantity = intFromValue(item.quantity, 0);
  const nextStock = Math.max(0, currentStock - quantity);
  const nextReserved = Math.max(0, currentReserved + quantity);

  await upsertObject(
    TABS.inventory,
    "sku",
    sku,
    {
      sku,
      name: item.name || existing?.name || sku,
      currentStock: nextStock,
      reservedStock: nextReserved,
      etaDays: item.etaDays || existing?.etaDays || 3,
      lastOrder: orderNumber,
      lastUpdated: nowIso()
    },
    INVENTORY_HEADERS
  );

  await patchObject(
    TABS.products,
    "slug",
    sku,
    {
      stock: nextStock,
      updatedAt: nowIso()
    },
    PRODUCT_HEADERS
  ).catch(() => {});
}

async function adjustCapacityForItem(item, orderNumber) {
  const sku = normalizeSku(item.productSlug || item.productId || item.name);
  if (!sku) return;

  const rows = await readSheetObjects(TABS.capacity);
  const existing = rows.find((row) => normalizeSku(row.sku) === sku);
  const quantity = intFromValue(item.quantity, 0);
  const maxPlanned = intFromValue(existing?.maxPlanned, Math.max(quantity * 20, 100));
  const currentReserved = intFromValue(existing?.currentReserved, 0) + quantity;
  const available = Math.max(0, maxPlanned - currentReserved);

  await upsertObject(
    TABS.capacity,
    "sku",
    sku,
    {
      sku,
      name: item.name || existing?.name || sku,
      maxPlanned,
      currentReserved,
      available,
      lastOrder: orderNumber,
      lastUpdated: nowIso()
    },
    CAPACITY_HEADERS
  );
}

export async function applyOrderEffectsToGoogleSheets({ items, orderNumber }) {
  if (!isGoogleSyncEnabled()) return;
  for (const item of items || []) {
    if (item.preorder) continue;
    if (intFromValue(item.quantity, 0) <= 0) continue;
    await adjustInventoryForItem(item, orderNumber);
    await adjustCapacityForItem(item, orderNumber);
  }
}
