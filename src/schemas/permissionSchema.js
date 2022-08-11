import Joi from 'joi'


const permissionsSchema = Joi.object({
	seeUsers: Joi.boolean().required(),
	addUsers: Joi.boolean().required(),
	deleteUsers: Joi.boolean().required(),
	editPermissions: Joi.boolean().required(),
}).length(4)


export {
	permissionsSchema,
}
