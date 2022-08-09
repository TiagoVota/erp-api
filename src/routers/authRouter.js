import { Router } from 'express'

import authMiddleware from '../middlewares/authMiddleware.js'
import permissionMiddleware from '../middlewares/permissionMiddleware.js'

import * as schemaValidation from '../middlewares/schemaValidation/index.js'

import { authController } from '../controllers/index.js'

import { userSchema, loginSchema } from '../schemas/userSchema.js'


const authRouter = Router()

authRouter.post(
	'/login',
	schemaValidation.bodyMiddleware(loginSchema),
	authController.loginUser,
)

authRouter.use(authMiddleware)

authRouter.post(
	'/sign-up',
	permissionMiddleware('addUsers'),
	schemaValidation.bodyMiddleware(userSchema),
	authController.signUpUser,
)

export default authRouter
