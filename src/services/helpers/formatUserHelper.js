const formatUserData = (user) => {
	const formatUserData = { ...user }
	delete formatUserData.password

	return formatUserData
}

const formatUsersData = (userList) => {
	const formattedUserList = userList.map(user => formatUserData(user))

	return formattedUserList
}


export {
	formatUserData,
	formatUsersData,
}
