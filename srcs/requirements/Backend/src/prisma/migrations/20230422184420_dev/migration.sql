-- DropForeignKey
ALTER TABLE "PrivateChatRoom" DROP CONSTRAINT "PrivateChatRoom_sender_id_receiver_id_fkey";

-- AddForeignKey
ALTER TABLE "PrivateChatRoom" ADD CONSTRAINT "PrivateChatRoom_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateChatRoom" ADD CONSTRAINT "PrivateChatRoom_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
