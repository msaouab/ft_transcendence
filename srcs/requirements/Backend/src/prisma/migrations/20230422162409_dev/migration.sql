/*
  Warnings:

  - You are about to drop the column `lastMessageDate` on the `PrivateMessage` table. All the data in the column will be lost.
  - You are about to drop the column `receiver_id` on the `PrivateMessage` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `PrivateMessage` table. All the data in the column will be lost.
  - Added the required column `chatRoom_id` to the `PrivateMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PrivateMessage" DROP CONSTRAINT "PrivateMessage_sender_id_receiver_id_fkey";

-- AlterTable
ALTER TABLE "PrivateMessage" DROP COLUMN "lastMessageDate",
DROP COLUMN "receiver_id",
DROP COLUMN "sender_id",
ADD COLUMN     "chatRoom_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PrivateChatRoom" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "lastMessageDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateChatRoom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrivateMessage" ADD CONSTRAINT "PrivateMessage_chatRoom_id_fkey" FOREIGN KEY ("chatRoom_id") REFERENCES "PrivateChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateChatRoom" ADD CONSTRAINT "PrivateChatRoom_sender_id_receiver_id_fkey" FOREIGN KEY ("sender_id", "receiver_id") REFERENCES "FriendsTab"("user_id", "friendUser_id") ON DELETE RESTRICT ON UPDATE CASCADE;
