import prisma from '../database/database.js'


const findOne = async () => {
	const enterprise = await prisma.enterprise.findFirst()

	return enterprise
}


const enterpriseRepository = {
	findOne,
}
export {
	enterpriseRepository
}
