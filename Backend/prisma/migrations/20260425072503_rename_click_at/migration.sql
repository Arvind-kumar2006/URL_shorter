/*
  Warnings:

  - You are about to drop the column `clickAt` on the `clicks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "idx_clicks_click_at";

-- AlterTable
ALTER TABLE "clicks" DROP COLUMN "clickAt",
ADD COLUMN     "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "idx_clicks_clicked_at" ON "clicks"("clickedAt");
