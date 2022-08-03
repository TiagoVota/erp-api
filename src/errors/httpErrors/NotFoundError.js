import { StatusCodes } from 'http-status-codes'

class NotFoundError extends Error {
	constructor(message) {
		super(message || 'Not found!')
		this.name = 'HttpError'
		this.status = StatusCodes.NOT_FOUND
	}
}


export default NotFoundError
