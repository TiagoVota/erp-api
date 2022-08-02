const makeAdminPermissions = () => {
	return {
		seeUsers: true,
		addUsers: true,
		deleteUsers: true,
		editPermissions: true,
	}
}


export {
	makeAdminPermissions,
}
