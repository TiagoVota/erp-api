import { ForbiddenError } from './httpErrors/index.js'


class ForbiddenNoAdminTransactionError extends ForbiddenError {
	constructor() {
		super('One user needs to be the enterprise admin to make the transaction!')
		this.name = 'ForbiddenNoAdminTransactionError'
	}
}


export default ForbiddenNoAdminTransactionError
