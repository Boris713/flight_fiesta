-- DropForeignKey
ALTER TABLE "Interest" DROP CONSTRAINT "Interest_cityId_fkey";

-- AlterTable
ALTER TABLE "Interest" ALTER COLUMN "cityId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;
