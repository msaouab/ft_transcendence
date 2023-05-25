/*
  Warnings:

  - You are about to drop the column `blocked` on the `PrivateChatRoom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PrivateChatRoom" DROP COLUMN "blocked",
ADD COLUMN     "block" BOOLEAN[] DEFAULT ARRAY[]::BOOLEAN[];
