-- CreateEnum
CREATE TYPE "InviteType" AS ENUM ('Friend', 'Game');

-- CreateTable
CREATE TABLE "InviteData" (
    "notification_id" TEXT NOT NULL,
    "type" "InviteType" NOT NULL,
    "invite_id" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "metadata" TEXT,

    CONSTRAINT "InviteData_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "_InviteDataRelation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InviteDataRelation_AB_unique" ON "_InviteDataRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_InviteDataRelation_B_index" ON "_InviteDataRelation"("B");

-- AddForeignKey
ALTER TABLE "_InviteDataRelation" ADD CONSTRAINT "_InviteDataRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "InviteData"("notification_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InviteDataRelation" ADD CONSTRAINT "_InviteDataRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "Notification"("notification_id") ON DELETE CASCADE ON UPDATE CASCADE;
