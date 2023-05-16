/*
  Warnings:

  - You are about to drop the column `level` on the `RankingData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RankingData" DROP COLUMN "level",
ADD COLUMN     "games" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "losing_streak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "winning_streak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xp" DOUBLE PRECISION NOT NULL DEFAULT 0;
