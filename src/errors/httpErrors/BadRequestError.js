import { StatusCodes } from 'http-status-codes'

class BadRequestError extends Error {
	constructor(message) {
		super(message || 'Bad Request!')
		this.name = 'HttpError'
		this.status = StatusCodes.BAD_REQUEST
	}
}


export default BadRequestError
