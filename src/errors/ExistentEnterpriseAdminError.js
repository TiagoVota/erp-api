import { ConflictError } from './httpErrors/index.js'


class ExistentEnterpriseAdminError extends ConflictError {
	constructor(adminId) {
		super(`The admin with id '${adminId}' has already registered a enterprise!`)
		this.name = 'ExistentEnterpriseAdminError'
	}
}


export default ExistentEnterpriseAdminError
