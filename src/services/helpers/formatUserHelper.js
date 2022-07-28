const formatTokenData = (user) => {
	const formatUserData = { ...user }
	delete formatUserData.password

	return formatUserData
}


export {
	formatTokenData,
}
