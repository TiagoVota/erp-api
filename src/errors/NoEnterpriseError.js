import { NotFoundError } from './httpErrors/index.js'


class NoEnterpriseError extends NotFoundError {
	constructor() {
		super('This ERP does not have a registered enterprise yet!')
		this.name = 'NoEnterpriseError'
	}
}


export default NoEnterpriseError
