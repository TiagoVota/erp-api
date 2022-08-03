import { StatusCodes } from 'http-status-codes'

import { healthService } from '../services/index.js'


const checkHealth = async (req, res, next) => {
	try {
		const healthMsg = await healthService.getHealth()
		
		return res.status(StatusCodes.OK).send(healthMsg)

	} catch (error) {
		next(error)
	}

}


export {
	checkHealth,
}
