import prisma from '../database/database.js'

import { permissionRepository } from './index.js'


const find = async ({ id, haveToIncludePermission }) => {
	const include = haveToIncludePermission
		? { include: { permissions: true } }
		: {}

	const user = await prisma.user.findFirst({
		where: {
			id,
		},
		...include,
	})

	return user
}

const findAdmin = async () => {
	const admin = await prisma.user.findFirst({
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


const findByCpf = async (cpf) => {
	const user = await prisma.user.findUnique({
		where: {
			cpf,
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


const findWithPermissions = async ({ take, skip }) => {
	const usersWithPermissions = await prisma.user.findMany({
		include: {
			permissions: true,
		},
		take,
		skip,
	})

	return usersWithPermissions
}


const insertUser = async (userData, permissionsOptions={}) => {
	const insertedInfo = await prisma.$transaction(async () => {
		const user = await insert(userData)
		
		const permissions = await permissionRepository.insert(
			user.id,
			permissionsOptions,
		)

		return [ user, permissions ]
	})

	return insertedInfo
}


const insert = async (userData) => {
	const user = await prisma.user.create({
		data: userData,
	})

	return user
}


const updateById = async ({ id, data }) => {
	const user = await prisma.user.update({
		where: {
			id,
		},
		data,
	})

	return user
}


const deleteById = async (id) => {
	const user = await prisma.user.delete({
		where: {
			id,
		},
	})

	return user
}


const userRepository = {
	find,
	findAdmin,
	findByEmail,
	findByCpf,
	findById,
	findWithPermissions,
	insertUser,
	updateById,
	deleteById,
}
export {
	userRepository
}
