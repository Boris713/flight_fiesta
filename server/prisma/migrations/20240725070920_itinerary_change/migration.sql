/*
  Warnings:

  - You are about to drop the column `location` on the `Itinerary` table. All the data in the column will be lost.
  - Added the required column `description` to the `Itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Itinerary" DROP COLUMN "location",
ADD COLUMN     "description" TEXT NOT NULL;
