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


const permissionRepository = {
	insert,
}
export {
	permissionRepository
}
