import { ForbiddenError } from './httpErrors/index.js'


class ForbiddenAdminDeleteError extends ForbiddenError {
	constructor(userId) {
		super(`User with id '${userId}' is a admin and can not be deleted!`)
		this.name = 'ForbiddenAdminDeleteError'
	}
}


export default ForbiddenAdminDeleteError
