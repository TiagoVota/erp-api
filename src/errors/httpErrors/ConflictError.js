import { StatusCodes } from 'http-status-codes'

class ConflictError extends Error {
	constructor(message) {
		super(message || 'Conflict!')
		this.name = 'HttpError'
		this.status = StatusCodes.CONFLICT
	}
}


export default ConflictError
