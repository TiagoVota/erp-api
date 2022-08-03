import { StatusCodes } from 'http-status-codes'

class UnauthorizedError extends Error {
	constructor(message) {
		super(message || 'Unauthorized!')
		this.name = 'HttpError'
		this.status = StatusCodes.UNAUTHORIZED
	}
}


export default UnauthorizedError
