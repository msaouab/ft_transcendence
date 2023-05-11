/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "tfa" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "avatar" SET DEFAULT '/app/public/default.png';
