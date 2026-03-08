# SAROMEN Website (Next.js + Tailwind + Prisma + Stripe)

## Stack
- Next.js (App Router)
- Tailwind CSS
- Prisma ORM (SQLite by default)
- Stripe checkout route
- Cookie auth (register/login/profile)
- Admin panel (admin cookie session)
- Global Basic Auth lock (`saradomen / saradomen`)

## 1) Local setup
```powershell
cd C:\Users\Domen\Documents\web-projects\saromen-website
copy .env.example .env
```

Uredi `.env` in nastavi vsaj:
- `AUTH_SECRET`
- `DATABASE_URL` (za lokalno lahko ostane `file:./dev.db`)
- `STRIPE_SECRET_KEY` in `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (test keys)

## 2) Install + Prisma
```powershell
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
```

## 3) Run dev server
```powershell
npm run dev
```

Odpri:
- `http://localhost:3000`

## 4) Auth & Admin
- Basic auth za celo stran:
  - username: `saradomen`
  - password: `saradomen`
- Admin login v `/admin`:
  - username: `admin`
  - password: `saromenadmin`

## 5) Deploy (GitHub + Vercel)
Push na `main` in v Vercelu nastavi iste env spremenljivke kot lokalno.

Minimalni production env:
- `AUTH_SECRET`
- `DATABASE_URL` (production DB)
- `BASIC_AUTH_USERNAME`
- `BASIC_AUTH_PASSWORD`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Opcijsko:
- `RESEND_API_KEY`
- `ORDER_FROM_EMAIL`
