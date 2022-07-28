import { ConflictError } from './httpErrors/index.js'


class ExistentUserError extends ConflictError {
	constructor(email) {
		super(`User with e-mail '${email}' already registered!`)
		this.name = 'ExistentUserError'
	}
}


export default ExistentUserError
