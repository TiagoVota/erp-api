import { StatusCodes } from 'http-status-codes'

import { userService } from '../services/index.js'


const signUpAdmin = async (req, res, next) => {
	const adminData = req.body

	try {
		const createdAdmin = await userService.createAdmin(adminData)

		return res.status(StatusCodes.CREATED).send(createdAdmin)

	} catch (error) {
		next(error)
	}
}


const signUpUser = async (req, res, next) => {
	const userData = req.body

	try {
		const createdUser = await userService.createUser(userData)

		return res.status(StatusCodes.CREATED).send(createdUser)

	} catch (error) {
		next(error)
	}
}


const loginUser = async (req, res, next) => {
	const userData = req.body

	try {
		const tokenInfo = await userService.authorizeUser(userData)

		return res.status(StatusCodes.OK).send(tokenInfo)

	} catch (error) {
		next(error)
	}
}


export {
	signUpAdmin,
	signUpUser,
	loginUser,
}
