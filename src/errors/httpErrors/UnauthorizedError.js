class UnauthorizedError extends Error {
	constructor(message) {
		super(message || 'Unauthorized!')
		this.name = 'HttpError'
		this.status = 401
	}
}


export default UnauthorizedError
