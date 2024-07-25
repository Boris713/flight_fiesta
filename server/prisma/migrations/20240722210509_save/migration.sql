/*
  Warnings:

  - A unique constraint covering the columns `[xid]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `xid` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "image" TEXT,
ADD COLUMN     "wikiLink" TEXT,
ADD COLUMN     "xid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Activity_xid_key" ON "Activity"("xid");
