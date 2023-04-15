/*
  Warnings:

  - You are about to drop the `FrindshipInvites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FrindshipInvites" DROP CONSTRAINT "FrindshipInvites_sender_id_fkey";

-- DropTable
DROP TABLE "FrindshipInvites";

-- CreateTable
CREATE TABLE "FriendshipInvites" (
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'Pending'
);

-- CreateIndex
CREATE UNIQUE INDEX "FriendshipInvites_sender_id_receiver_id_key" ON "FriendshipInvites"("sender_id", "receiver_id");

-- AddForeignKey
ALTER TABLE "FriendshipInvites" ADD CONSTRAINT "FriendshipInvites_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
