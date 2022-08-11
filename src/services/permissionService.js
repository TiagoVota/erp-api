import { permissionRepository } from '../repositories/index.js'

import { userService } from './index.js'

import { formatPermissionsData } from './helpers/formatPermissionHelper.js'


const updateUserPermissions = async ({ userId, permissionsData }) => {
	await userService.validateUserByIdOrFail(userId)

	const editedPermissions = await permissionRepository.updateByUserId({
		userId,
		data: formatPermissionsData(permissionsData),
	})

	return editedPermissions
}


export {
	updateUserPermissions,
}
