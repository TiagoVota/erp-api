-- DropIndex
DROP INDEX "transactions_payeeId_key";

-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "addTransactions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deleteTransactions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "editTransactions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "seeTransactions" BOOLEAN NOT NULL DEFAULT false;
