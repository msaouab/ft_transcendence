/*
  Warnings:

  - The `tfa` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "tfa",
ADD COLUMN     "tfa" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "PrivateChatRoomStatus";

-- DropEnum
DROP TYPE "tfa";
