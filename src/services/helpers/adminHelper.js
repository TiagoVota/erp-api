const makeAdminPermissions = () => {
	return {
		seeUsers: true,
		addUsers: true,
		deleteUsers: true,
		editPermissions: true,
		seeTransactions: true,
		addTransactions: true,
		editTransactions: true,
		deleteTransactions: true,
	}
}


export {
	makeAdminPermissions,
}
