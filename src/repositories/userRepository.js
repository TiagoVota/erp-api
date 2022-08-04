import prisma from '../database/database.js'

import { permissionRepository } from './permissionRepository.js'


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
		data: userData
	})

	return user
}


const userRepository = {
	findAdmin,
	findByEmail,
	findByCpf,
	findById,
	insertUser,
}
export {
	userRepository
}
