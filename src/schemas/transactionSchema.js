import Joi from 'joi'


const ONE_BILLION = 10 ** 9
const ONE_BILLION_IN_CENTS = ONE_BILLION * 100

const transactionSchema = Joi.object({
	value: Joi.number().integer().min(1).max(ONE_BILLION_IN_CENTS).required(),
	payerId: Joi.number().integer().min(1).required(),
	payeeId: Joi.number().integer().min(1).required(),
	description: Joi.string().max(255),
	writeOffDate: Joi.date(),
	createdAt: Joi.date(),
}).min(3).max(6)

const transactionUpdateSchema = Joi.object({
	value: Joi.number().integer().min(1).max(ONE_BILLION_IN_CENTS).required(),
	description: Joi.string().max(255),
	writeOffDate: Joi.date(),
	createdAt: Joi.date(),
}).min(1).max(4)

const transactionsQuerySchema = Joi.object({
	limit: Joi.number().min(1).max(1000),
	offset: Joi.number().min(0),
})

const transactionParamsSchema = Joi.object({
	transactionId: Joi.number().integer().min(1).required(),
}).length(1)


export {
	transactionSchema,
	transactionUpdateSchema,
	transactionsQuerySchema,
	transactionParamsSchema,
}
