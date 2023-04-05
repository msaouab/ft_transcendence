-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Online', 'Offline', 'Idle', 'DoNotDisturb', 'InGame');

-- CreateEnum
CREATE TYPE "ChanRoles" AS ENUM ('Admin', 'Owner', 'Member');

-- CreateEnum
CREATE TYPE "ChanType" AS ENUM ('Public', 'Private', 'Secret');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('OnGoing', 'Finished');

-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('Novice', 'Intermediate', 'Advanced', 'Master');

-- CreateEnum
CREATE TYPE "MemeberStatusTime" AS ENUM ('Permanent', 'Temporary');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('Pending', 'Accepted', 'Rejected');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dateJoined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT '<ralative_path>',
    "status" "Status" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrindshipInvites" (
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'Pending'
);

-- CreateTable
CREATE TABLE "FriendsTab" (
    "user_id" TEXT NOT NULL,
    "friendUser_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PrivateMessage" (
    "id" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PrivateMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockTab" (
    "user_id" TEXT NOT NULL,
    "blockedUser_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ChannelsJoinTab" (
    "user_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "channel_name" TEXT NOT NULL,
    "role" "ChanRoles" NOT NULL
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chann_type" "ChanType" NOT NULL,
    "owner_id" TEXT NOT NULL,
    "password" TEXT,
    "limit_members" INTEGER NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembersTab" (
    "channel_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BannedMembers" (
    "channel_id" TEXT NOT NULL,
    "banned_id" TEXT NOT NULL,
    "status" "MemeberStatusTime",
    "status_end_time" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "AdminMembers" (
    "channel_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "kickedMembers" (
    "channel_id" TEXT NOT NULL,
    "kicked_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MutedMembers" (
    "channel_id" TEXT NOT NULL,
    "muted_id" TEXT NOT NULL,
    "status" "MemeberStatusTime",
    "status_end_time" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameStatus" "GameStatus" NOT NULL,
    "player1_id" TEXT NOT NULL,
    "player2_id" TEXT NOT NULL,
    "player1_pts" INTEGER NOT NULL,
    "player2_pts" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameInvites" (
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'Pending',
    "validUntil" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "RankingData" (
    "user_id" TEXT NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "loses" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,
    "rank" "Rank" NOT NULL DEFAULT 'Novice'
);

-- CreateTable
CREATE TABLE "Achievements" (
    "achievement_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("achievement_id")
);

-- CreateTable
CREATE TABLE "AchievementsAssignement" (
    "achievement_id" INTEGER NOT NULL,
    "player_id" TEXT NOT NULL,

    CONSTRAINT "AchievementsAssignement_pkey" PRIMARY KEY ("achievement_id","player_id")
);

-- CreateTable
CREATE TABLE "GameHistoryTab" (
    "game_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "GameHistoryTab_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FrindshipInvites_sender_id_receiver_id_key" ON "FrindshipInvites"("sender_id", "receiver_id");

-- CreateIndex
CREATE UNIQUE INDEX "FriendsTab_user_id_friendUser_id_key" ON "FriendsTab"("user_id", "friendUser_id");

-- CreateIndex
CREATE UNIQUE INDEX "BlockTab_user_id_blockedUser_id_key" ON "BlockTab"("user_id", "blockedUser_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelsJoinTab_channel_id_key" ON "ChannelsJoinTab"("channel_id");

-- CreateIndex
CREATE INDEX "channel_id" ON "ChannelsJoinTab"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MembersTab_channel_id_member_id_key" ON "MembersTab"("channel_id", "member_id");

-- CreateIndex
CREATE UNIQUE INDEX "BannedMembers_channel_id_banned_id_key" ON "BannedMembers"("channel_id", "banned_id");

-- CreateIndex
CREATE UNIQUE INDEX "AdminMembers_channel_id_admin_id_key" ON "AdminMembers"("channel_id", "admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "kickedMembers_channel_id_kicked_id_key" ON "kickedMembers"("channel_id", "kicked_id");

-- CreateIndex
CREATE UNIQUE INDEX "MutedMembers_channel_id_muted_id_key" ON "MutedMembers"("channel_id", "muted_id");

-- CreateIndex
CREATE UNIQUE INDEX "GameInvites_sender_id_receiver_id_key" ON "GameInvites"("sender_id", "receiver_id");

-- CreateIndex
CREATE UNIQUE INDEX "RankingData_user_id_key" ON "RankingData"("user_id");

-- AddForeignKey
ALTER TABLE "FrindshipInvites" ADD CONSTRAINT "FrindshipInvites_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendsTab" ADD CONSTRAINT "FriendsTab_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateMessage" ADD CONSTRAINT "PrivateMessage_sender_id_receiver_id_fkey" FOREIGN KEY ("sender_id", "receiver_id") REFERENCES "FriendsTab"("user_id", "friendUser_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockTab" ADD CONSTRAINT "BlockTab_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelsJoinTab" ADD CONSTRAINT "ChannelsJoinTab_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembersTab" ADD CONSTRAINT "MembersTab_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannedMembers" ADD CONSTRAINT "BannedMembers_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminMembers" ADD CONSTRAINT "AdminMembers_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kickedMembers" ADD CONSTRAINT "kickedMembers_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutedMembers" ADD CONSTRAINT "MutedMembers_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameInvites" ADD CONSTRAINT "GameInvites_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingData" ADD CONSTRAINT "RankingData_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementsAssignement" ADD CONSTRAINT "AchievementsAssignement_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "Achievements"("achievement_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementsAssignement" ADD CONSTRAINT "AchievementsAssignement_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "RankingData"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistoryTab" ADD CONSTRAINT "GameHistoryTab_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistoryTab" ADD CONSTRAINT "GameHistoryTab_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
