import { ConflictError } from './httpErrors/index.js'


class ExistentUserEmailError extends ConflictError {
	constructor(email) {
		super(`User with e-mail '${email}' already registered!`)
		this.name = 'ExistentUserEmailError'
	}
}


export default ExistentUserEmailError
