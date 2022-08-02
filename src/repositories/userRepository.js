import prisma from '../database/database.js'


const findAdmin = async () => {
	const admin = await prisma.user.findUnique({
		where: {
			isAdmin: true,
		},
	})

	return admin
}


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
	findAdmin,
	findByEmail,
	findById,
	insert,
}
export {
	userRepository
}
