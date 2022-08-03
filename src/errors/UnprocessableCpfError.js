import { UnprocessableEntityError } from './httpErrors/index.js'


class UnprocessableCpfError extends UnprocessableEntityError {
	constructor(cpf) {
		super(`Invalid cpf: '${cpf}'!`)
		this.name = 'UnprocessableCpfError'
	}
}


export default UnprocessableCpfError
