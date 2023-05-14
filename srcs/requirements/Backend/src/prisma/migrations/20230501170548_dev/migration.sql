/*
  Warnings:

  - Added the required column `receiver_id` to the `PrivateMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `PrivateMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrivateMessage" ADD COLUMN     "receiver_id" TEXT NOT NULL,
ADD COLUMN     "sender_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PrivateMessage" ADD CONSTRAINT "PrivateMessage_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateMessage" ADD CONSTRAINT "PrivateMessage_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
