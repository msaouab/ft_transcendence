/*
  Warnings:

  - Added the required column `lastMessageDate` to the `PrivateMessage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessageRequestStatus" AS ENUM ('Pending', 'Accepted', 'Rejected');

-- AlterTable
ALTER TABLE "PrivateMessage" ADD COLUMN     "lastMessageDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "MessageRequestStatus" NOT NULL DEFAULT 'Pending';
