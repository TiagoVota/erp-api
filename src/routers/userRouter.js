import { Router } from 'express'

import authMiddleware from '../middlewares/authMiddleware.js'
import permissionMiddleware from '../middlewares/permissionMiddleware.js'

import * as schemaValidation from '../middlewares/schemaValidation/index.js'

import { userController } from '../controllers/index.js'

import { usersQuerySchema } from '../schemas/userSchema.js'


const userRouter = Router()

userRouter.use(authMiddleware)

userRouter.get(
	'',
	permissionMiddleware('seeUsers'),
	schemaValidation.queryMiddleware(usersQuerySchema),
	userController.getUsersAndPermissions,
)

export default userRouter
