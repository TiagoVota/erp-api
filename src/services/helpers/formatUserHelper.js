const formatUserData = (user) => {
	const formattedUserData = { ...user }
	delete formattedUserData.password

	return formattedUserData
}

const formatUsersData = (userList) => {
	const formattedUserList = userList.map(formatUserData)

	return formattedUserList
}


export {
	formatUserData,
	formatUsersData,
}
