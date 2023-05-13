-- DropForeignKey
ALTER TABLE "PrivateMessage" DROP CONSTRAINT "PrivateMessage_chatRoom_id_fkey";

-- AddForeignKey
ALTER TABLE "PrivateMessage" ADD CONSTRAINT "PrivateMessage_chatRoom_id_fkey" FOREIGN KEY ("chatRoom_id") REFERENCES "PrivateChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
