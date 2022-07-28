import { Router } from 'express'

import authMiddleware from '../middlewares/authMiddleware.js'

import healthRouter from './healthRouter.js'
import authRouter from './authRouter.js'


const router = Router()

router.use('/health', healthRouter)
router.use('/auth', authRouter)

// router.use(authMiddleware)


export default router
