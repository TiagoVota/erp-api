import { permissionRepository } from '../repositories/index.js'

import { ForbiddenPermissionError } from '../errors/index.js'


const permissionMiddleware = (permissionName) => {
	return async (req, res, next) => {
		const user = res.locals.user

		try {
			const permissions = await permissionRepository.findByUserId(user.id)

			const userHaveRoutePermission = Boolean(permissions[permissionName])

			if (!userHaveRoutePermission) throw new ForbiddenPermissionError(permissionName)
	
			res.locals.user.permissions = permissions

			next()

		} catch (error) {
			next(error)
		}
	}
}


export default permissionMiddleware
