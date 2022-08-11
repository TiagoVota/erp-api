import { transactionRepository } from '../repositories/index.js'

import { userService } from './index.js'

import { formatDate } from '../utils/dates.js'

import {
	ConflictSameUserTransactionError,
	ForbiddenNoAdminTransactionError,
	UnprocessableDateError,
} from '../errors/index.js'


const createTransaction = async (createTransactionBody) => {
	const formattedBody = formatTransactionBodyOrFail(createTransactionBody)

	const payer = await userService.validateUserByIdOrFail(formattedBody.payerId)
	const payee = await userService.validateUserByIdOrFail(formattedBody.payeeId)

	validateTransactionPrecedenceOrFail(payer, payee)

	const transaction = await transactionRepository.insert(formattedBody)

	return transaction
}


const formatTransactionBodyOrFail = (createTransactionBody) => {
	const { writeOffDate, createdAt } = createTransactionBody

	const formattedBody = {
		...createTransactionBody,
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


export {
	createTransaction,
}