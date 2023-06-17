/*
  Warnings:

  - You are about to drop the `InviteData` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InviteData" DROP CONSTRAINT "InviteData_notif_id_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "receiver_id" TEXT,
ADD COLUMN     "sender_id" TEXT,
ADD COLUMN     "type" "InviteType" NOT NULL;

-- DropTable
DROP TABLE "InviteData";
