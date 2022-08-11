import prisma from '../database/database.js'


const findById = async (id) => {
	const transaction = await prisma.transaction.findUnique({
		where: {
			id,
		},
	})

	return transaction
}

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


const updateById = async ({ id, data }) => {
	const transaction = await prisma.transaction.update({
		where: {
			id,
		},
		data,
	})

	return transaction
}


const transactionRepository = {
	findById,
	findMany,
	insert,
	updateById,
}
export {
	transactionRepository
}
