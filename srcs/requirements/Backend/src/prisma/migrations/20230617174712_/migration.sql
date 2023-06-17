/*
  Warnings:

  - A unique constraint covering the columns `[receiver_id,sender_id,type]` on the table `InviteData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InviteData_receiver_id_sender_id_type_key" ON "InviteData"("receiver_id", "sender_id", "type");
