/*
  Warnings:

  - A unique constraint covering the columns `[xid]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Activity_xid_key" ON "Activity"("xid");
