import Joi from 'joi'


const enterpriseSchema = Joi.object({
	cnpj: Joi.string().min(14).max(18).required(),
	corporateName: Joi.string().min(2).max(80).required(),
	tradingName: Joi.string().min(2).max(80).required(),
}).length(3)


export {
	enterpriseSchema,
}
