/*
  Warnings:

  - You are about to drop the column `metadata` on the `InviteData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InviteData" DROP COLUMN "metadata",
ADD COLUMN     "receiver_id" TEXT,
ADD COLUMN     "sender_id" TEXT;
