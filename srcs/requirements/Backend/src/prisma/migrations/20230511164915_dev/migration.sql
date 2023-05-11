/*
  Warnings:

  - The `tfa` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "tfa" AS ENUM ('true', 'false');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp_base32" TEXT,
ADD COLUMN     "otp_verified" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "tfa",
ADD COLUMN     "tfa" "tfa" NOT NULL DEFAULT 'false';
