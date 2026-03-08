CREATE TABLE "GiftVoucher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codeHash" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientName" TEXT,
    "purchaserEmail" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "redeemedAt" DATETIME,
    "redeemedOrderNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "GiftVoucher_codeHash_key" ON "GiftVoucher"("codeHash");
