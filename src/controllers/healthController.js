import { healthService } from '../services/index.js'


const checkHealth = async (req, res, next) => {
	try {
		const healthMsg = await healthService.getHealth()
		
		return res.status(200).send(healthMsg)

	} catch (error) {
		next(error)
	}

}


export {
	checkHealth,
}
