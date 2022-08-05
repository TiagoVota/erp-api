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


const createEnterprise = async (req, res, next) => {
	const enterprise = req.body
	const user = res.locals.user

	try {
		const createdEnterprise = await enterpriseService
			.createEnterprise({ enterprise, user })

		return res.status(StatusCodes.CREATED).send(createdEnterprise)

	} catch (error) {
		next(error)
	}
}


export {
	getEnterprise,
	createEnterprise,
}
