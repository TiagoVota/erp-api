import { StatusCodes } from 'http-status-codes'

class ForbiddenError extends Error {
	constructor(message) {
		super(message || 'Forbidden!')
		this.name = 'HttpError'
		this.status = StatusCodes.FORBIDDEN
	}
}


export default ForbiddenError
