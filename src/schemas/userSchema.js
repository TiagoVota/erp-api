import Joi from 'joi'


const userSchema = Joi.object({
	name: Joi.string().min(2).max(80).required(),
	email: Joi.string().email().max(80).required(),
	password: Joi.string().min(5).max(80).required(),
}).length(3)

const loginSchema = Joi.object({
	email: Joi.string().email().max(80).required(),
	password: Joi.string().min(5).max(80).required(),
}).length(2)


export {
	userSchema,
	loginSchema,
}
