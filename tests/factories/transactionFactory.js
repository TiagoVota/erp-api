import { faker } from '@faker-js/faker'

import prisma from '../../src/database/database'
import { makeValidDate } from './dateFactory'
import { generateId } from './idFactory'
import { createUser } from './userFactory'


const makeTransactionBody = (defaultBody={}) => {
	const { description, writeOffDate, createdAt } = defaultBody

	const body = {
		value: defaultBody?.value || faker.datatype.number({ min: 1, max: 100000 }),
		payerId: defaultBody?.payerId || generateId(),
		payeeId: defaultBody?.payeeId || generateId(),
	}

	if (description) body.description = description
	if (writeOffDate) body.writeOffDate = makeValidDate(writeOffDate)
	if (createdAt) body.createdAt = makeValidDate(createdAt)

	return body
}


const makeUpdateTransactionBody = (defaultBody) => {
	const body = makeTransactionBody(defaultBody)
	delete body.payerId
	delete body.payeeId

	return body
}


const findTransactionById = async (id) => {
	const transaction = await prisma.transaction.findUnique({
		where: {
			id,
		},
	})

	return transaction
}


const createTransaction = async (defaultBody={}) => {
	const { payerId, payeeId } = defaultBody
	if (!payerId) {
		const payer = await createUser()
		defaultBody.payerId = payer.id
	}
	if (!payeeId) {
		const payee = await createUser({ isAdmin: true })
		defaultBody.payeeId = payee.id
	}
	const transactionData = makeTransactionBody(defaultBody)

	const user = await prisma.transaction.create({
		data: transactionData,
	})

	return user
}


export {
	makeTransactionBody,
	makeUpdateTransactionBody,
	findTransactionById,
	createTransaction,
}
