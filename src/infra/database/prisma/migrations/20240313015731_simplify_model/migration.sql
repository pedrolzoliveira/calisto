/*
  Warnings:

  - You are about to drop the `NewsCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProcessBatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfileCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NewsCategory" DROP CONSTRAINT "NewsCategory_batchId_fkey";

-- DropForeignKey
ALTER TABLE "NewsCategory" DROP CONSTRAINT "NewsCategory_newsLink_fkey";

-- DropForeignKey
ALTER TABLE "ProcessBatch" DROP CONSTRAINT "ProcessBatch_newsLink_fkey";

-- DropForeignKey
ALTER TABLE "ProfileCategory" DROP CONSTRAINT "ProfileCategory_profileId_fkey";

-- Enable extension
CREATE EXTENSION vector;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "embedding" vector(1536);

-- DropTable
DROP TABLE "NewsCategory";

-- DropTable
DROP TABLE "ProcessBatch";

-- DropTable
DROP TABLE "ProfileCategory";

-- CreateTable
CREATE TABLE "Category" (
    "text" VARCHAR(25) NOT NULL,
    "embedding" vector(1536),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("text")
);

-- CreateTable
CREATE TABLE "_CategoryToProfile" (
    "A" VARCHAR(25) NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToProfile_AB_unique" ON "_CategoryToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToProfile_B_index" ON "_CategoryToProfile"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToProfile" ADD CONSTRAINT "_CategoryToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("text") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProfile" ADD CONSTRAINT "_CategoryToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
