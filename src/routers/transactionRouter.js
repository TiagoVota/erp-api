import { Router } from 'express'

import authMiddleware from '../middlewares/authMiddleware.js'
import permissionMiddleware from '../middlewares/permissionMiddleware.js'

import * as schemaValidation from '../middlewares/schemaValidation/index.js'

import { transactionController } from '../controllers/index.js'

import {
	transactionSchema,
	transactionsQuerySchema,
	transactionUpdateSchema,
} from '../schemas/transactionSchema.js'


const transactionRouter = Router()

transactionRouter.use(authMiddleware)

transactionRouter.get(
	'',
	permissionMiddleware('seeTransactions'),
	schemaValidation.queryMiddleware(transactionsQuerySchema),
	transactionController.getTransactions,
)

transactionRouter.post(
	'',
	permissionMiddleware('addTransactions'),
	schemaValidation.bodyMiddleware(transactionSchema),
	transactionController.addTransaction,
)

transactionRouter.put(
	'/:transactionId',
	permissionMiddleware('editTransactions'),
	schemaValidation.bodyMiddleware(transactionUpdateSchema),
	transactionController.editTransaction,
)


export default transactionRouter
