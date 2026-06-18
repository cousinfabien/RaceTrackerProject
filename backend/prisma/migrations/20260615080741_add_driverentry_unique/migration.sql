/*
  Warnings:

  - A unique constraint covering the columns `[userId,leagueId]` on the table `DriverEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DriverEntry_userId_leagueId_key" ON "DriverEntry"("userId", "leagueId");
