import { StatusCodes } from 'http-status-codes'

class UnprocessableEntityError extends Error {
	constructor(message) {
		super(message || 'Unprocessable Entity!')
		this.name = 'HttpError'
		this.status = StatusCodes.UNPROCESSABLE_ENTITY
	}
}


export default UnprocessableEntityError
