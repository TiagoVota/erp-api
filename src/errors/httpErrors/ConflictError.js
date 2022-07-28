class ConflictError extends Error {
	constructor(message) {
		super(message || 'Conflict!')
		this.name = 'HttpError'
		this.status = 409
	}
}


export default ConflictError
