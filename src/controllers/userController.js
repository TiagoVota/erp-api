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


const getUser = async (req, res, next) => {
	const user = res.locals.user
	const userId = Number(req.params.userId)

	try {
		const userInfo = await userService.findUser({ userId, user })

		return res.status(StatusCodes.OK).send(userInfo)

	} catch (error) {
		next(error)
	}
}


const editUser = async (req, res, next) => {
	const userId = Number(req.params.userId)
	const userData = req.body
	const requestUser = res.locals.user

	try {
		const editedUser = await userService.updateUser({
			userId,
			userData,
			requestUser,
		})

		return res.status(StatusCodes.OK).send(editedUser)

	} catch (error) {
		next(error)
	}
}


const editUserByAdmin = async (req, res, next) => {
	const userId = Number(req.params.userId)
	const userData = req.body
	const requestUser = res.locals.user

	try {
		const editedUser = await userService.updateUserByAdmin({
			userId,
			userData,
			requestUser,
		})

		return res.status(StatusCodes.OK).send(editedUser)

	} catch (error) {
		next(error)
	}
}


const deleteUser = async (req, res, next) => {
	const userId = Number(req.params.userId)

	try {
		const deletedUser = await userService.removeUser({ userId })

		return res.status(StatusCodes.OK).send(deletedUser)

	} catch (error) {
		next(error)
	}
}


export {
	getUsersAndPermissions,
	getUser,
	editUser,
	editUserByAdmin,
	deleteUser,
}
