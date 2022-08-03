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

const findUserById = async (id) => {
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
	})

	return user
}


export {
	makeUserBody,
	findUserById,
}
