/*
  Warnings:

  - You are about to drop the column `clickedAt` on the `clicks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "idx_clicks_clicked_at";

-- AlterTable
ALTER TABLE "clicks" DROP COLUMN "clickedAt",
ADD COLUMN     "clickAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "idx_clicks_click_at" ON "clicks"("clickAt");
