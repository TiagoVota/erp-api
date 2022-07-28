import { validationErrors } from './helpers/validateErrorsHelper.js'
import { sanitizeInput } from '../helpers/validationHelper.js'

import { SchemaError } from '../../errors/index.js'


function paramsMiddleware(schema) {
	return (req, res, next) => {
		const params = sanitizeInput(req.params)

		const errors = validationErrors({
			objectToValid: params,
			objectValidation: schema
		})

		if (errors) throw new SchemaError(errors)

		next()
	}
}


export default paramsMiddleware
