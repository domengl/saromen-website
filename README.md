# SAROMEN Website

## Stack
- Next.js (App Router)
- Tailwind CSS
- Prisma ORM (SQLite default)
- Stripe checkout route
- Cookie auth (login/register/profile/admin)
- Global Basic Auth lock (`saradomen / saradomen`)
- Google Sheets sync (orders, inventory, capacity, products, coupons, special offers)

## Local setup
```powershell
cd C:\Users\Domen\Documents\web-projects\saromen-website
copy .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

## Admin access
- Website lock:
  - username: `saradomen`
  - password: `saradomen`
- Admin user login (normal login form `/login`):
  - username: `admin` or `admin@saromen.com`
  - password: value from `ADMIN_PASSWORD`
- Admin page: `/admin`

## Google Sheets integration
Set in `.env`:
- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (escaped `\n` format)
or use:
- `GOOGLE_SERVICE_ACCOUNT_JSON`

Optional tab names:
- `GSHEET_TAB_ORDERS`
- `GSHEET_TAB_INVENTORY`
- `GSHEET_TAB_CAPACITY`
- `GSHEET_TAB_PRODUCTS`
- `GSHEET_TAB_COUPONS`
- `GSHEET_TAB_SPECIAL_OFFERS`

### Expected tab columns
- `Products`:
  - `slug,name,category,scent,description,price,stock,etaDays,salePercent,isTop,isNew,active,updatedAt`
- `Coupons`:
  - `code,percent,minAmount,active,updatedAt`
- `SpecialOffers`:
  - `id,title,description,percent,active,startAt,endAt,updatedAt`
- `Orders`:
  - `orderNumber,createdAt,status,customerEmail,subtotal,discount,shipping,total,couponCode,voucherCode,trackingNumber,invoiceNumber,itemsJson,updatedAt,note`
- `Inventory`:
  - `sku,name,currentStock,reservedStock,etaDays,lastOrder,lastUpdated`
- `Capacity`:
  - `sku,name,maxPlanned,currentReserved,available,lastOrder,lastUpdated`

Headers are auto-created by API if missing.

## New admin endpoints
- `POST /api/admin/sheets/sync` -> sync products + coupons to sheets
- `GET/POST /api/admin/special-offers` -> admin-only special offers
- `POST /api/admin/orders/status` -> update order status + write status to sheets

## Customer-facing endpoints
- `GET /api/products` -> products (prefers Google Sheets)
- `GET /api/coupons` -> coupons (prefers Google Sheets)
- `GET /api/special-offers` -> active special offers
- `POST /api/checkout` -> creates order + writes order/inventory/capacity to sheets

## Deploy
Push `main` -> Vercel.
Set same env vars in Vercel as local.
