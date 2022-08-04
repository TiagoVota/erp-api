import prisma from '../../src/database/database'


const findPermissionByUserId = async (userId) => {
	const user = await prisma.permission.findUnique({
		where: {
			userId,
		},
	})

	return user
}


const createUserPermissions = async (userId, ...permissionNames) => {
	const permissions = {}
	permissionNames.forEach(key => permissions[key] = true)

	const permission = await prisma.permission.create({
		data: {
			userId,
			...permissions,
		}
	})

	return permission
}


export {
	findPermissionByUserId,
	createUserPermissions,
}
