import { ConflictError } from './httpErrors/index.js'


class ExistentAdminError extends ConflictError {
	constructor() {
		super('Admin is already registered in this enterprise!')
		this.name = 'ExistentAdminError'
	}
}


export default ExistentAdminError
