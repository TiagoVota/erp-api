import { Router } from 'express'

import authMiddleware from '../middlewares/authMiddleware.js'
import permissionMiddleware from '../middlewares/permissionMiddleware.js'

import * as schemaValidation from '../middlewares/schemaValidation/index.js'

import { userController } from '../controllers/index.js'

import {
	editUserSchema,
	userParamsSchema,
	usersQuerySchema,
} from '../schemas/userSchema.js'
import { permissionsSchema } from '../schemas/permissionSchema.js'


const userRouter = Router()

userRouter.use(authMiddleware)

userRouter.get(
	'',
	permissionMiddleware('seeUsers'),
	schemaValidation.queryMiddleware(usersQuerySchema),
	userController.getUsersAndPermissions,
)
userRouter.get(
	'/:userId',
	schemaValidation.paramsMiddleware(userParamsSchema),
	userController.getUser,
)

userRouter.put(
	'/:userId',
	schemaValidation.paramsMiddleware(userParamsSchema),
	schemaValidation.bodyMiddleware(editUserSchema),
	userController.editUser,
)
userRouter.put(
	'/permissions/:userId',
	permissionMiddleware('editPermissions'),
	schemaValidation.paramsMiddleware(userParamsSchema),
	schemaValidation.bodyMiddleware(permissionsSchema),
	userController.editUserPermissions,
)

userRouter.delete(
	'/:userId',
	permissionMiddleware('deleteUsers'),
	schemaValidation.paramsMiddleware(userParamsSchema),
	userController.deleteUser,
)


export default userRouter
