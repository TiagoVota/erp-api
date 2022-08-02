import { Router } from 'express'

import * as schemaValidation from '../middlewares/schemaValidation/index.js'

import { authController } from '../controllers/index.js'

import { userSchema, loginSchema } from '../schemas/userSchema.js'


const authRouter = Router()

authRouter.post(
	'/sign-up',
	schemaValidation.bodyMiddleware(userSchema),
	authController.signUpUser
)
authRouter.post(
	'/sign-up/admin',
	schemaValidation.bodyMiddleware(userSchema),
	authController.signUpAdmin
)
authRouter.post(
	'/login',
	schemaValidation.bodyMiddleware(loginSchema),
	authController.loginUser
)


export default authRouter
