import { UnprocessableEntityError } from './httpErrors/index.js'


class SchemaError extends UnprocessableEntityError {
	constructor(message) {
		super(message)
		this.name = 'SchemaError'
		this.message = message
	}
}


export default SchemaError
