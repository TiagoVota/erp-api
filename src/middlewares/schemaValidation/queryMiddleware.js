import { validationErrors } from './helpers/validateErrorsHelper.js'
import { sanitizeInput } from '../helpers/validationHelper.js'

import { SchemaError } from '../../errors/index.js'


function queryMiddleware(schema) {
	return (req, res, next) => {
		const query = sanitizeInput(req.query)

		const errors = validationErrors({
			objectToValid: query,
			objectValidation: schema
		})

		if (errors) throw new SchemaError(errors)

		next()
	}
}


export default queryMiddleware
