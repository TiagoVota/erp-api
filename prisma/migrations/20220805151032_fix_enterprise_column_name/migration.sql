/*
  Warnings:

  - You are about to drop the column `tradiongName` on the `enterpises` table. All the data in the column will be lost.
  - Added the required column `tradingName` to the `enterpises` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "enterpises" DROP COLUMN "tradiongName",
ADD COLUMN     "tradingName" VARCHAR(80) NOT NULL;
