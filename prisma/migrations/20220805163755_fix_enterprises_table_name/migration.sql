/*
  Warnings:

  - You are about to drop the `enterpises` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "enterpises" DROP CONSTRAINT "enterpises_adminId_fkey";

-- DropTable
DROP TABLE "enterpises";

-- CreateTable
CREATE TABLE "enterprises" (
    "id" SERIAL NOT NULL,
    "cnpj" VARCHAR(14) NOT NULL,
    "corporateName" VARCHAR(80) NOT NULL,
    "tradingName" VARCHAR(80) NOT NULL,
    "adminId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enterprises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "enterprises_cnpj_key" ON "enterprises"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "enterprises_adminId_key" ON "enterprises"("adminId");

-- AddForeignKey
ALTER TABLE "enterprises" ADD CONSTRAINT "enterprises_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
