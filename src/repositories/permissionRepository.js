import prisma from '../database/database.js'


const insert = async (userId, permissionsOptions={}) => {
	const permissions = await prisma.permission.create({
		data: {
			userId,
			...permissionsOptions,
		},
	})

	return permissions
}


const findByUserId = async (userId) => {
	const permissions = await prisma.permission.findUnique({
		where: {
			userId,
		},
	})

	return permissions
}


const updateByUserId = async ({ userId, data }) => {
	const permissions = await prisma.permission.update({
		where: {
			userId,
		},
		data,
	})

	return permissions
}


const permissionRepository = {
	insert,
	findByUserId,
	updateByUserId,
}
export {
	permissionRepository
}
