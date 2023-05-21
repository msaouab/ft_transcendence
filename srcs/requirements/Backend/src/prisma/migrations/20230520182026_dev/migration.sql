/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `BlockTab` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `BlockTab` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "BlockTab_user_id_blockedUser_id_key";

-- AlterTable
ALTER TABLE "BlockTab" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BlockTab_uuid_key" ON "BlockTab"("uuid");
