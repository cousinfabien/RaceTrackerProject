/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `basePP` on the `VehicleModel` table. All the data in the column will be lost.
  - The `category` column on the `VehicleModel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[manufacturer,model]` on the table `VehicleModel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "VehicleCategory" AS ENUM ('GR1', 'GR2', 'GR3', 'GR4', 'GRB');

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "VehicleModel" DROP COLUMN "basePP",
ALTER COLUMN "basePower" DROP NOT NULL,
ALTER COLUMN "baseWeight" DROP NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "VehicleCategory";

-- CreateIndex
CREATE UNIQUE INDEX "VehicleModel_manufacturer_model_key" ON "VehicleModel"("manufacturer", "model");
