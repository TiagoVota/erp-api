-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "payerId" INTEGER NOT NULL,
    "payeeId" INTEGER NOT NULL,
    "description" VARCHAR(255),
    "writeOffDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_payeeId_key" ON "transactions"("payeeId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payeeId_fkey" FOREIGN KEY ("payeeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
