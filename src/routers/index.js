import { Router } from 'express'

import healthRouter from './healthRouter.js'
import adminRouter from './adminRouter.js'
import authRouter from './authRouter.js'


const router = Router()

router.use('/health', healthRouter)
router.use('/admin', adminRouter)
router.use('/auth', authRouter)


export default router
