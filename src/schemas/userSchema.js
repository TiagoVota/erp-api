import Joi from 'joi'


const userSchema = Joi.object({
	cpf: Joi.string().min(11).max(14).required(),
	name: Joi.string().min(2).max(80).required(),
	email: Joi.string().email().max(80).required(),
	password: Joi.string().min(5).max(80).required(),
}).length(4)

const loginSchema = Joi.object({
	email: Joi.string().email().max(80).required(),
	password: Joi.string().min(5).max(80).required(),
}).length(2)


export {
	userSchema,
	loginSchema,
}
