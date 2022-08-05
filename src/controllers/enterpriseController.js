import { StatusCodes } from 'http-status-codes'

import { enterpriseService } from '../services/index.js'


const getEnterprise = async (req, res, next) => {
	try {
		const enterprise = await enterpriseService.findEnterprise()

		return res.status(StatusCodes.OK).send(enterprise)

	} catch (error) {
		next(error)
	}
}


export {
	getEnterprise,
}
