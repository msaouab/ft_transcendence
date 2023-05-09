/*
  Warnings:

  - A unique constraint covering the columns `[user_id,channel_id]` on the table `ChannelsJoinTab` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ChannelsJoinTab_channel_id_key";

-- DropIndex
DROP INDEX "channel_id";

-- CreateIndex
CREATE UNIQUE INDEX "ChannelsJoinTab_user_id_channel_id_key" ON "ChannelsJoinTab"("user_id", "channel_id");
