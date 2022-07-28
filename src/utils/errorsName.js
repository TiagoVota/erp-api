import * as personalizedErrors from '../errors/index.js'


const isPersonalizedError = (errorName) => {
	return Boolean(personalizedErrors[errorName])
}


export {
	isPersonalizedError,
}
