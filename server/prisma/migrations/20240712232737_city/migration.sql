/*
  Warnings:

  - Added the required column `cityId` to the `Interest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityId` to the `Itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interest" ADD COLUMN     "cityId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Itinerary" ADD COLUMN     "cityId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);
-- Insert a default city
INSERT INTO "City" ("name") VALUES ('Default City');

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
