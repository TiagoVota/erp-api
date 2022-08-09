import { UnprocessableEntityError } from './httpErrors/index.js'


class UnprocessableCnpjError extends UnprocessableEntityError {
	constructor(cnpj) {
		super(`Invalid cnpj: '${cnpj}'!`)
		this.name = 'UnprocessableCnpjError'
	}
}


export default UnprocessableCnpjError
