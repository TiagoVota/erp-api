import prisma from '../database/database.js'


const findMany = async ({ take, skip, includeUserData }) => {
	const include = includeUserData
		? {
			include: {
				payee: true,
				payer: true,
			},
		}
		: {}

	const transactions = await prisma.transaction.findMany({
		...include,
		take,
		skip,
	})

	return transactions
}


const insert = async (data) => {
	const transaction = await prisma.transaction.create({
		data,
	})

	return transaction
}


const transactionRepository = {
	findMany,
	insert,
}
export {
	transactionRepository
}
