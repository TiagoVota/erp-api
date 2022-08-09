import { StatusCodes } from 'http-status-codes'

import { userService } from '../services/index.js'


const getUsersAndPermissions = async (req, res, next) => {
	const query = req.query

	try {
		const usersInfo = await userService.findUsersAndPermissions(query)

		return res.status(StatusCodes.OK).send(usersInfo)

	} catch (error) {
		next(error)
	}
}


export {
	getUsersAndPermissions,
}
