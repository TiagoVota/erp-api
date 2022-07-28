import prisma from '../database/database.js'


const findByEmail = async (email) => {
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	})

	return user
}


const findById = async (id) => {
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
	})

	return user
}


const insert = async (userData) => {
	const user = await prisma.user.create({
		data: userData
	})

	return user
}


const userRepository = {
	findByEmail,
	findById,
	insert,
}
export {
	userRepository
}
