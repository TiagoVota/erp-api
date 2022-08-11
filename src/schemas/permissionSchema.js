import Joi from 'joi'


const permissionsSchema = Joi.object({
	seeUsers: Joi.boolean().required(),
	addUsers: Joi.boolean().required(),
	deleteUsers: Joi.boolean().required(),
	editPermissions: Joi.boolean().required(),
	seeTransactions: Joi.boolean().required(),
	addTransactions: Joi.boolean().required(),
	editTransactions: Joi.boolean().required(),
	deleteTransactions: Joi.boolean().required(),
}).length(8)


export {
	permissionsSchema,
}
