import { StatusCodes } from 'http-status-codes'


const serverMiddlewareError = (err, req, res, next) => {
	console.log(`Middleware de erro:\n  ${err}`)
	
	return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
}


export default serverMiddlewareError
