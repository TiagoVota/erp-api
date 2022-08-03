/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `enterpises` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adminId]` on the table `enterpises` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "enterpises_cnpj_key" ON "enterpises"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "enterpises_adminId_key" ON "enterpises"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_userId_key" ON "permissions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");
