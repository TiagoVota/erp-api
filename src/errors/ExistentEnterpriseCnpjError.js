import { ConflictError } from './httpErrors/index.js'


class ExistentEnterpriseCnpjError extends ConflictError {
	constructor(cnpj) {
		super(`Enterprise with cnpj '${cnpj}' already registered!`)
		this.name = 'ExistentEnterpriseCnpjError'
	}
}


export default ExistentEnterpriseCnpjError
