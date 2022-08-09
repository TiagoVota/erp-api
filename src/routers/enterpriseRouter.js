import { Router } from 'express'

import authMiddleware from '../middlewares/authMiddleware.js'

import { enterpriseController } from '../controllers/index.js'


const enterpriseRouter = Router()


enterpriseRouter.use(authMiddleware)
enterpriseRouter.get(
	'',
	enterpriseController.getEnterprise,
)


export default enterpriseRouter
