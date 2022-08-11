import { transactionRepository } from '../repositories/index.js'

import { userService } from './index.js'

import { formatDate } from '../utils/dates.js'
import { formatTransactionsData } from './helpers/formatTransactionHelper.js'

import {
	ConflictSameUserTransactionError,
	ForbiddenNoAdminTransactionError,
	NoTransactionByIdError,
	UnprocessableDateError,
} from '../errors/index.js'


const findTransactions = async ({ requestUser, query }) => {
	const canSeeUsers = requestUser.permissions.seeUsers

	const DEFAULT_LIMIT = 100
	const DEFAULT_OFFSET = 0
	
	const limit = Number(query?.limit) || DEFAULT_LIMIT
	const offset = Number(query?.offset) || DEFAULT_OFFSET

	const transactions = await transactionRepository.findMany({
		take: limit,
		skip: offset * limit,
		includeUserData: canSeeUsers,
	})

	const formattedTransactions = Boolean(canSeeUsers)
		? formatTransactionsData(transactions)
		: transactions

	return formattedTransactions
}


const createTransaction = async (createTransactionBody) => {
	const formattedBody = formatTransactionBodyOrFail(createTransactionBody)

	const payer = await userService.validateUserByIdOrFail(formattedBody.payerId)
	const payee = await userService.validateUserByIdOrFail(formattedBody.payeeId)

	validateTransactionPrecedenceOrFail(payer, payee)

	const transaction = await transactionRepository.insert(formattedBody)

	return transaction
}


const updateTransaction = async ({ transactionData, transactionId }) => {
	const formattedBody = formatTransactionBodyOrFail(transactionData)

	await validateTransactionByIdOrFail(transactionId)

	const transaction = await transactionRepository.updateById({
		id: transactionId,
		data: formattedBody,
	})

	return transaction
}


const formatTransactionBodyOrFail = (transactionBody) => {
	const { writeOffDate, createdAt } = transactionBody

	const formattedBody = {
		...transactionBody,
	}

	if (writeOffDate) {
		const formattedWriteOffDate = validateDateOrFail(writeOffDate)
		formattedBody.writeOffDate = formattedWriteOffDate
	}

	if (createdAt) {
		const formattedCreatedAtDate = validateDateOrFail(createdAt)
		formattedBody.createdAt = formattedCreatedAtDate
	}

	return formattedBody
}

const validateDateOrFail = (date) => {
	const validDate = formatDate(date)

	if (!validDate) throw new UnprocessableDateError(date)
	return validDate
}

const validateTransactionPrecedenceOrFail = (payer, payee) => {
	const isSameUser = Boolean(payer.id === payee.id)
	if (isSameUser) throw new ConflictSameUserTransactionError()

	const haveAtLeastOneAdmin = Boolean(payer.isAdmin || payee.isAdmin)
	if (!haveAtLeastOneAdmin) throw new ForbiddenNoAdminTransactionError()
}

const validateTransactionByIdOrFail = async (transactionId) => {
	const transaction = await transactionRepository.findById(transactionId)
	if (!transaction) throw new NoTransactionByIdError(transactionId)

	return transaction
}


export {
	findTransactions,
	createTransaction,
	updateTransaction,
}
