import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import { cpf } from 'cpf-cnpj-validator'

import prisma from '../../src/database/database'


const makeUserBody = (defaultBody) => {
	const userBody = {
		cpf: defaultBody?.cpf || cpf.generate(),
		name: defaultBody?.name || faker.name.findName(),
		email: defaultBody?.email || faker.internet.email(),
		password: defaultBody?.password || faker.internet.password(),
	}

	return userBody
}


const makeUserLoginBody = (defaultBody) => {
	const userLoginBody = {
		email: defaultBody?.email || faker.internet.email(),
		password: defaultBody?.password || faker.internet.password(),
	}

	return userLoginBody
}


const makeUpdateUserBody = (defaultBody, isAdmin) => {
	const userBody = makeUserBody(defaultBody)
	Boolean(isAdmin)
		? delete userBody.password
		: delete userBody.cpf

	return userBody
}


const findUserById = async (id) => {
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
	})

	return user
}


const createUser = async (defaultBody) => {
	const userBody = makeUserBody(defaultBody)
	const hashPassword = bcrypt.hashSync(userBody.password, 12)

	const user = await prisma.user.create({
		data: {
			...userBody,
			email: userBody.email.toLowerCase(),
			password: hashPassword,
			isAdmin: Boolean(defaultBody?.isAdmin),
		},
	})

	return user
}


export {
	makeUserBody,
	makeUserLoginBody,
	makeUpdateUserBody,
	findUserById,
	createUser,
}
