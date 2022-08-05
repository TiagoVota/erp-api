import { Router } from 'express'

import authMiddleware from '../middlewares/authMiddleware.js'
import * as schemaValidation from '../middlewares/schemaValidation/index.js'

import {
	authController,
	enterpriseController
} from '../controllers/index.js'

import { userSchema } from '../schemas/userSchema.js'
import { enterpriseSchema } from '../schemas/enterpriseSchema.js'


const adminRouter = Router()

adminRouter.post(
	'/auth/sign-up',
	schemaValidation.bodyMiddleware(userSchema),
	authController.signUpAdmin,
)


adminRouter.use(authMiddleware)
adminRouter.post(
	'/enterprise',
	schemaValidation.bodyMiddleware(enterpriseSchema),
	enterpriseController.createEnterprise,
)


export default adminRouter
