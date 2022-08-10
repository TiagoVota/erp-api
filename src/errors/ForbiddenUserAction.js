import { ForbiddenError } from './httpErrors/index.js'


class ForbiddenUserAction extends ForbiddenError {
	constructor(userId) {
		super(`This action can be done only by the user with id '${userId}'!`)
		this.name = 'ForbiddenUserAction'
	}
}


export default ForbiddenUserAction
