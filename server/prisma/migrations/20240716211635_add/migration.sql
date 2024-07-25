-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "times" TEXT[],

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);
