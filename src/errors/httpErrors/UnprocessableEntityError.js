class UnprocessableEntityError extends Error {
	constructor(message) {
		super(message || 'Unprocessable Entity!')
		this.name = 'HttpError'
		this.status = 422
	}
}


export default UnprocessableEntityError
