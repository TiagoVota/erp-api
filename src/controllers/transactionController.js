import { StatusCodes } from 'http-status-codes'

import { transactionService } from '../services/index.js'


const addTransaction = async (req, res, next) => {
	const userData = req.body

	try {
		const createdTransaction = await transactionService
			.createTransaction(userData)

		return res.status(StatusCodes.CREATED).send(createdTransaction)

	} catch (error) {
		next(error)
	}
}


export {
	addTransaction,
}
