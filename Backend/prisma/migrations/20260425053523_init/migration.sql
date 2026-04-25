-- CreateTable
CREATE TABLE "urls" (
    "id" SERIAL NOT NULL,
    "shortCode" VARCHAR(12) NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "title" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "clickCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clicks" (
    "id" SERIAL NOT NULL,
    "urlId" INTEGER NOT NULL,
    "clickAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" VARCHAR(45) NOT NULL,
    "userAgent" TEXT,
    "referrer" TEXT,
    "country" VARCHAR(64),
    "deviceType" VARCHAR(20),

    CONSTRAINT "clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "urls_shortCode_key" ON "urls"("shortCode");

-- CreateIndex
CREATE INDEX "idx_urls_short_code" ON "urls"("shortCode");

-- CreateIndex
CREATE INDEX "idx_urls_expires_at" ON "urls"("expiresAt");

-- CreateIndex
CREATE INDEX "idx_clicks_url_id" ON "clicks"("urlId");

-- CreateIndex
CREATE INDEX "idx_clicks_click_at" ON "clicks"("clickAt");

-- AddForeignKey
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
