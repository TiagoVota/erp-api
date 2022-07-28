import { NotFoundError } from './httpErrors/index.js'


class NoUserError extends NotFoundError {
	constructor(email) {
		super(`User not found with e-mail '${email}'!`)
		this.name = 'NoUserError'
	}
}


export default NoUserError
