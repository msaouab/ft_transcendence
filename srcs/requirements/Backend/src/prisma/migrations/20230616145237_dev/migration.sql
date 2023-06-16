/*
  Warnings:

  - Added the required column `roomId` to the `GameInvites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameInvites" ADD COLUMN     "roomId" TEXT NOT NULL;
