import { StatusCodes } from 'http-status-codes'

import { userService } from '../services/index.js'


const getUsersAndPermissions = async (req, res, next) => {
	try {
		const usersInfo = await userService.findUsersAndPermissions()

		return res.status(StatusCodes.OK).send(usersInfo)

	} catch (error) {
		next(error)
	}
}


export {
	getUsersAndPermissions,
}
