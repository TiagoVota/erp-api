-- CreateTable
CREATE TABLE "health" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "health_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterpises" (
    "id" SERIAL NOT NULL,
    "cnpj" VARCHAR(14) NOT NULL,
    "corporateName" VARCHAR(80) NOT NULL,
    "tradiongName" VARCHAR(80) NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "enterpises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(80) NOT NULL,
    "password" VARCHAR(80) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "seeUsers" BOOLEAN NOT NULL DEFAULT false,
    "addUsers" BOOLEAN NOT NULL DEFAULT false,
    "deleteUsers" BOOLEAN NOT NULL DEFAULT false,
    "editPermissions" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "health_name_key" ON "health"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "enterpises" ADD CONSTRAINT "enterpises_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
