import { Router } from 'express'

import * as schemaValidation from '../middlewares/schemaValidation/index.js'

import { authController } from '../controllers/index.js'

import { userSchema } from '../schemas/userSchema.js'


const adminRouter = Router()

adminRouter.post(
	'/auth/sign-up',
	schemaValidation.bodyMiddleware(userSchema),
	authController.signUpAdmin,
)


export default adminRouter
