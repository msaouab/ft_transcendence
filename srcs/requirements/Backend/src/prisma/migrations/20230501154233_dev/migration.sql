/*
  Warnings:

  - You are about to drop the column `receiver_id` on the `PrivateMessage` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `PrivateMessage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PrivateMessage" DROP CONSTRAINT "PrivateMessage_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "PrivateMessage" DROP CONSTRAINT "PrivateMessage_sender_id_fkey";

-- AlterTable
ALTER TABLE "PrivateMessage" DROP COLUMN "receiver_id",
DROP COLUMN "sender_id";
