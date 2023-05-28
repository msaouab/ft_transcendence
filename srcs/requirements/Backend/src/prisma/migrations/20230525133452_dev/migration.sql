/*
  Warnings:

  - You are about to drop the column `block` on the `PrivateChatRoom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PrivateChatRoom" DROP COLUMN "block",
ADD COLUMN     "blocked" BOOLEAN NOT NULL DEFAULT false;
