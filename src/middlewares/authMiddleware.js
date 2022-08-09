import { verifyToken } from '../utils/authorizations.js'

import { userService } from '../services/index.js'

import { AuthError } from '../errors/index.js'


const authMiddleware = async (req, res, next) => {
	const authorization = req.headers['authorization']
	const token = authorization?.replace('Bearer ', '')

	try {
		if (!token) throw new AuthError()

		const tokenUser = verifyToken(token)

		const user = await userService.validateUserByIdOrFail(tokenUser?.id)
		delete user.password
	
		res.locals.user = user

		next()

	} catch (error) {
		next(error)
	}
}


export default authMiddleware
