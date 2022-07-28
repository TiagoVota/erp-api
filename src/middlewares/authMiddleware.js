import { verifyToken } from '../utils/authorizations.js'

import { AuthError } from '../errors/index.js'


const authMiddleware = async (req, res, next) => {
	const authorization = req.headers['authorization']
	const token = authorization?.replace('Bearer ', '')

	try {
		if (!token) throw new AuthError()

		const user = verifyToken(token)
		if (!user) throw new AuthError()
	
		res.locals.user = user

		next()

	} catch (error) {
		next(error)
	}
}


export default authMiddleware
