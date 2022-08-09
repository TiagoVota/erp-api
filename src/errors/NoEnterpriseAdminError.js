import { NotFoundError } from './httpErrors/index.js'


class NoEnterpriseAdminError extends NotFoundError {
	constructor(adminId) {
		super(`Enterprise not found  for admin with id '${adminId}'!`)
		this.name = 'NoEnterpriseAdminError'
	}
}


export default NoEnterpriseAdminError
