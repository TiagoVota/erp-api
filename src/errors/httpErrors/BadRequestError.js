class BadRequestError extends Error {
	constructor(message) {
		super(message || 'Bad Request!')
		this.name = 'HttpError'
		this.status = 400
	}
}


export default BadRequestError
