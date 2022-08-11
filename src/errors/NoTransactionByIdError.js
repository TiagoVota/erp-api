import { NotFoundError } from './httpErrors/index.js'


class NoTransactionByIdError extends NotFoundError {
	constructor(id) {
		super(`Transaction not found with id '${id}'!`)
		this.name = 'NoTransactionByIdError'
	}
}


export default NoTransactionByIdError
