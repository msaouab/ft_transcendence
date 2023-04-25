/*
  Warnings:

  - You are about to drop the column `status` on the `PrivateMessage` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PrivateChatRoomStatus" AS ENUM ('Pending', 'Accepted', 'Rejected');

-- AlterTable
ALTER TABLE "PrivateChatRoom" ADD COLUMN     "status" "PrivateChatRoomStatus" NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "PrivateMessage" DROP COLUMN "status";

-- DropEnum
DROP TYPE "MessageRequestStatus";
