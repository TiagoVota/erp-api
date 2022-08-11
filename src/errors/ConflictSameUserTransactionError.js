import { ConflictError } from './httpErrors/index.js'


class ConflictSameUserTransactionError extends ConflictError {
	constructor() {
		super('The same user can not be the payer and payee at the same time!')
		this.name = 'ConflictSameUserTransactionError'
	}
}


export default ConflictSameUserTransactionError
