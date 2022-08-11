import { Router } from 'express'

import authMiddleware from '../middlewares/authMiddleware.js'
import permissionMiddleware from '../middlewares/permissionMiddleware.js'

import * as schemaValidation from '../middlewares/schemaValidation/index.js'

import { transactionController } from '../controllers/index.js'

import { transactionSchema } from '../schemas/transactionSchema.js'


const transactionRouter = Router()

transactionRouter.use(authMiddleware)

transactionRouter.post(
	'',
	permissionMiddleware('addTransactions'),
	schemaValidation.bodyMiddleware(transactionSchema),
	transactionController.addTransaction,
)


export default transactionRouter
