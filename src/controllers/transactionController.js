import { StatusCodes } from 'http-status-codes'

import { transactionService } from '../services/index.js'


const getTransactions = async (req, res, next) => {
	const requestUser = res.locals.user
	const query = req.query

	try {
		const transactions = await transactionService.findTransactions({
			requestUser,
			query,
		})

		return res.status(StatusCodes.OK).send(transactions)

	} catch (error) {
		next(error)
	}
}


const addTransaction = async (req, res, next) => {
	const transactionData = req.body

	try {
		const createdTransaction = await transactionService
			.createTransaction(transactionData)

		return res.status(StatusCodes.CREATED).send(createdTransaction)

	} catch (error) {
		next(error)
	}
}


const editTransaction = async (req, res, next) => {
	const transactionData = req.body
	const transactionId = Number(req.params.transactionId)

	try {
		const updatedTransaction = await transactionService.updateTransaction({
			transactionData,
			transactionId,
		})

		return res.status(StatusCodes.OK).send(updatedTransaction)

	} catch (error) {
		next(error)
	}
}


const removeTransaction = async (req, res, next) => {
	const transactionId = Number(req.params.transactionId)

	try {
		const deletedTransaction = await transactionService.deleteTransaction({
			transactionId,
		})

		return res.status(StatusCodes.OK).send(deletedTransaction)

	} catch (error) {
		next(error)
	}
}


export {
	getTransactions,
	addTransaction,
	editTransaction,
	removeTransaction,
}
