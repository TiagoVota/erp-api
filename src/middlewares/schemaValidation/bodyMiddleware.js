import { validationErrors } from './helpers/validateErrorsHelper.js'
import { sanitizeInput } from '../helpers/validationHelper.js'

import { SchemaError } from '../../errors/index.js'


function bodyMiddleware(schema) {
	return (req, res, next) => {
		const body = sanitizeInput(req.body)

		const errors = validationErrors({
			objectToValid: body,
			objectValidation: schema
		})

		if (errors) throw new SchemaError(errors)

		next()
	}
}


export default bodyMiddleware
