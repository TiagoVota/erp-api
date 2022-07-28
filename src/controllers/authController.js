import { userService } from '../services/index.js'


const signUpUser = async (req, res, next) => {
	const userData = req.body

	try {
		const createdUser = await userService.createUser(userData)

		return res.status(201).send(createdUser)

	} catch (error) {
		next(error)
	}
}


const loginUser = async (req, res, next) => {
	const userData = req.body

	try {
		const tokenInfo = await userService.AuthorizeUser(userData)

		return res.status(201).send(tokenInfo)

	} catch (error) {
		next(error)
	}
}


export {
	signUpUser,
	loginUser,
}
