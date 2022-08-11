import prisma from '../database/database.js'


const insert = async (data) => {
	const transaction = await prisma.transaction.create({
		data,
	})

	return transaction
}


const transactionRepository = {
	insert,
}
export {
	transactionRepository
}
