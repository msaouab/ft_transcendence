/*
  Warnings:

  - The primary key for the `InviteData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `invite_id` on the `InviteData` table. All the data in the column will be lost.
  - You are about to drop the column `notification_id` on the `InviteData` table. All the data in the column will be lost.
  - You are about to drop the `_InviteDataRelation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `notif_id` to the `InviteData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_notification_id_fkey";

-- DropForeignKey
ALTER TABLE "_InviteDataRelation" DROP CONSTRAINT "_InviteDataRelation_A_fkey";

-- DropForeignKey
ALTER TABLE "_InviteDataRelation" DROP CONSTRAINT "_InviteDataRelation_B_fkey";

-- AlterTable
ALTER TABLE "InviteData" DROP CONSTRAINT "InviteData_pkey",
DROP COLUMN "invite_id",
DROP COLUMN "notification_id",
ADD COLUMN     "notif_id" TEXT NOT NULL,
ADD CONSTRAINT "InviteData_pkey" PRIMARY KEY ("notif_id");

-- DropTable
DROP TABLE "_InviteDataRelation";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InviteData" ADD CONSTRAINT "InviteData_notif_id_fkey" FOREIGN KEY ("notif_id") REFERENCES "Notification"("notification_id") ON DELETE RESTRICT ON UPDATE CASCADE;
