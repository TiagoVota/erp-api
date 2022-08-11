import prisma from '../../../src/database/database.js'


const makePermissionOptions = (haveAdminPermission) => {
	const permissionsOptions = Boolean(haveAdminPermission)
		? {
			seeUsers: true,
			addUsers: true,
			deleteUsers: true,
			editPermissions: true,
			seeTransactions: true,
			addTransactions: true,
			editTransactions: true,
			deleteTransactions: true,
		}
		: {}

	return permissionsOptions
}


const createPermission = async (userId, permissionsOptions={}) => {
	return prisma.permission.create({
		data: {
			userId,
			...permissionsOptions,
		},
	})
}


export {
	makePermissionOptions,
	createPermission,
}
