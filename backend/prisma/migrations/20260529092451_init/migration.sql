-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DRIVER', 'ORGANIZER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "League" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizerId" INTEGER NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regulation" (
    "id" SERIAL NOT NULL,
    "maxPP" DECIMAL(5,2) NOT NULL,
    "maxPower" INTEGER NOT NULL,
    "minWeight" INTEGER NOT NULL,
    "allowedTyres" TEXT[],
    "bopEnabled" BOOLEAN NOT NULL DEFAULT false,
    "tuningAllowed" BOOLEAN NOT NULL DEFAULT true,
    "leagueId" INTEGER NOT NULL,

    CONSTRAINT "Regulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleModel" (
    "id" SERIAL NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "basePP" DECIMAL(5,2) NOT NULL,
    "basePower" INTEGER NOT NULL,
    "baseWeight" INTEGER NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverEntry" (
    "id" SERIAL NOT NULL,
    "championshipPoints" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "leagueId" INTEGER NOT NULL,

    CONSTRAINT "DriverEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverCarSetup" (
    "id" SERIAL NOT NULL,
    "currentPP" DECIMAL(5,2) NOT NULL,
    "currentPower" INTEGER NOT NULL,
    "currentWeight" INTEGER NOT NULL,
    "tyres" TEXT NOT NULL,
    "turboInstalled" BOOLEAN NOT NULL DEFAULT false,
    "ballastApplied" BOOLEAN NOT NULL DEFAULT false,
    "vehicleModelId" INTEGER NOT NULL,
    "driverEntryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriverCarSetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Race" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER NOT NULL,
    "raceDate" TIMESTAMP(3) NOT NULL,
    "laps" INTEGER NOT NULL,
    "qualifyingFuelConsumption" INTEGER NOT NULL DEFAULT 0,
    "raceFuelConsumption" INTEGER NOT NULL DEFAULT 0,
    "qualifyingTyreWear" INTEGER NOT NULL DEFAULT 0,
    "raceTyreWear" INTEGER NOT NULL DEFAULT 0,
    "leagueId" INTEGER NOT NULL,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "layout" TEXT,
    "trackLength" DOUBLE PRECISION,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "fastestLap" BOOLEAN NOT NULL DEFAULT false,
    "raceId" INTEGER NOT NULL,
    "driverEntryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Regulation_leagueId_key" ON "Regulation"("leagueId");

-- CreateIndex
CREATE UNIQUE INDEX "DriverCarSetup_driverEntryId_key" ON "DriverCarSetup"("driverEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "Track_name_layout_key" ON "Track"("name", "layout");

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Regulation" ADD CONSTRAINT "Regulation_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverEntry" ADD CONSTRAINT "DriverEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverEntry" ADD CONSTRAINT "DriverEntry_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverCarSetup" ADD CONSTRAINT "DriverCarSetup_vehicleModelId_fkey" FOREIGN KEY ("vehicleModelId") REFERENCES "VehicleModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverCarSetup" ADD CONSTRAINT "DriverCarSetup_driverEntryId_fkey" FOREIGN KEY ("driverEntryId") REFERENCES "DriverEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_driverEntryId_fkey" FOREIGN KEY ("driverEntryId") REFERENCES "DriverEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
