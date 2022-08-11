import { UnprocessableEntityError } from './httpErrors/index.js'


class UnprocessableDateError extends UnprocessableEntityError {
	constructor(date) {
		super(`Invalid date: '${date}'!`)
		this.name = 'UnprocessableDateError'
	}
}


export default UnprocessableDateError
