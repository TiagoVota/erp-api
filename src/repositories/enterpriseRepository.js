import prisma from '../database/database.js'


const findOne = async () => {
	const enterprise = await prisma.enterprise.findFirst()

	return enterprise
}


const findByCnpj = async (cnpj) => {
	const enterprise = await prisma.enterprise.findUnique({
		where: {
			cnpj,
		},
	})

	return enterprise
}


const findByAdminId = async (adminId) => {
	const enterprise = await prisma.enterprise.findUnique({
		where: {
			adminId,
		},
	})

	return enterprise
}


const insert = async ({ adminId, enterpriseData }) => {
	const enterprise = await prisma.enterprise.create({
		data: {
			adminId,
			...enterpriseData,
		},
	})

	return enterprise
}


const update = async ({ adminId, enterpriseData }) => {
	const enterprise = await prisma.enterprise.update({
		where: {
			adminId
		},
		data: enterpriseData,
	})

	return enterprise
}


const enterpriseRepository = {
	findOne,
	findByCnpj,
	findByAdminId,
	insert,
	update,
}
export {
	enterpriseRepository
}
