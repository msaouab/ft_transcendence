/*
  Warnings:

  - You are about to drop the column `lastMessageDate` on the `PrivateChatRoom` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PrivateChatRoom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PrivateChatRoom" DROP COLUMN "lastMessageDate",
DROP COLUMN "status";
