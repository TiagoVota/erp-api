import { ForbiddenError } from './httpErrors/index.js'


class ForbiddenAdminError extends ForbiddenError {
	constructor() {
		super('This user has no admin permission!')
		this.name = 'ForbiddenAdminError'
	}
}


export default ForbiddenAdminError
