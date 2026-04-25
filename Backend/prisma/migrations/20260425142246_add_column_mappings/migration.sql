/*
  Warnings:

  - You are about to drop the column `clickAt` on the `clicks` table. All the data in the column will be lost.
  - You are about to drop the column `deviceType` on the `clicks` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `clicks` table. All the data in the column will be lost.
  - You are about to drop the column `urlId` on the `clicks` table. All the data in the column will be lost.
  - Added the required column `ip_address` to the `clicks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url_id` to the `clicks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "clicks" DROP CONSTRAINT "clicks_urlId_fkey";

-- DropIndex
DROP INDEX "idx_clicks_click_at";

-- DropIndex
DROP INDEX "idx_clicks_url_id";

-- AlterTable
ALTER TABLE "clicks" DROP COLUMN "clickAt",
DROP COLUMN "deviceType",
DROP COLUMN "ipAddress",
DROP COLUMN "urlId",
ADD COLUMN     "click_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "device_type" VARCHAR(20),
ADD COLUMN     "ip_address" VARCHAR(45) NOT NULL,
ADD COLUMN     "url_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "idx_clicks_url_id" ON "clicks"("url_id");

-- CreateIndex
CREATE INDEX "idx_clicks_click_at" ON "clicks"("click_at");

-- AddForeignKey
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
