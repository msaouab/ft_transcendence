/*
  Warnings:

  - You are about to drop the column `draws` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `loses` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `game` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `limit_members` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('OnGoing', 'Finished');

-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('Novice', 'Intermediate', 'Advanced', 'Master');

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'InGame';

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "limit_members" INTEGER NOT NULL,
ADD COLUMN     "owner_id" TEXT NOT NULL,
ADD COLUMN     "password" TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "seen" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "draws",
DROP COLUMN "loses",
DROP COLUMN "wins";

-- DropTable
DROP TABLE "game";

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
CREATE TABLE "BannedUsers" (
    "channel_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "InviteData" (
    "invite_id" TEXT NOT NULL,

    CONSTRAINT "InviteData_pkey" PRIMARY KEY ("invite_id")
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
CREATE TABLE "PlayerAchievements" (
    "player_id" TEXT NOT NULL,
    "achievement_id" INTEGER[],

    CONSTRAINT "PlayerAchievements_pkey" PRIMARY KEY ("player_id")
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
CREATE UNIQUE INDEX "RankingData_user_id_key" ON "RankingData"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "BannedUsers_channel_id_user_id_key" ON "BannedUsers"("channel_id", "user_id");

-- AddForeignKey
ALTER TABLE "RankingData" ADD CONSTRAINT "RankingData_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannedUsers" ADD CONSTRAINT "BannedUsers_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerAchievements" ADD CONSTRAINT "PlayerAchievements_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "RankingData"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementsAssignement" ADD CONSTRAINT "AchievementsAssignement_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "Achievements"("achievement_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistoryTab" ADD CONSTRAINT "GameHistoryTab_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistoryTab" ADD CONSTRAINT "GameHistoryTab_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
