import { ForbiddenError } from './httpErrors/index.js'


class ForbiddenPermissionError extends ForbiddenError {
	constructor(permissionName) {
		super(`This user have no '${permissionName}' permission!`)
		this.name = 'ForbiddenPermissionError'
	}
}


export default ForbiddenPermissionError
