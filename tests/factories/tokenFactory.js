import jwt from 'jsonwebtoken'

import { createUser } from './userFactory'


const generateValidToken = async (generateTokenInfo={}) => {
	const { defaultUser, createUserData } = generateTokenInfo
	
	const user = defaultUser || (await createUser(createUserData))
	delete user.password

	const token = jwt.sign(user, process.env.JWT_SECRET)

	return token
}


export {
	generateValidToken,
}
