import prisma from '../../src/database/database'


const makePermissionsOptions = (defaultOptions) => {
	return {
		seeUsers: defaultOptions?.seeUsers || true,
		addUsers: defaultOptions?.addUsers || true,
		deleteUsers: defaultOptions?.deleteUsers || true,
		editPermissions: defaultOptions?.editPermissions || true,
	}
}


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
	makePermissionsOptions,
	findPermissionByUserId,
	createUserPermissions,
}
