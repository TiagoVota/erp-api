import { ConflictError } from './httpErrors/index.js'


class ExistentUserCpfError extends ConflictError {
	constructor(cpf) {
		super(`User with cpf '${cpf}' already registered!`)
		this.name = 'ExistentUserCpfError'
	}
}


export default ExistentUserCpfError
