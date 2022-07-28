class NotFoundError extends Error {
	constructor(message) {
		super(message || 'Not found!')
		this.name = 'HttpError'
		this.status = 404
	}
}


export default NotFoundError
