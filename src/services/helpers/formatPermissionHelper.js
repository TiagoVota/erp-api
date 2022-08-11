const formatPermissionsData = (permissions) => {
	const formattedPermissionsData = {}

	for (const [ permissionName, bool ] of Object.entries(permissions)) {
		formattedPermissionsData[permissionName] = Boolean(bool)
	}

	return formattedPermissionsData
}


export {
	formatPermissionsData,
}
