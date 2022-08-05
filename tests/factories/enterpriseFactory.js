import { faker } from '@faker-js/faker'
import { cnpj } from 'cpf-cnpj-validator'

import prisma from '../../src/database/database'

import { createUser, makeUserBody } from './userFactory'


const makeEnterpriseBody = (defaultBody) => {
	const enterpriseBody = {
		cnpj: defaultBody?.cnpj || cnpj.generate(),
		corporateName: defaultBody?.corporateName || faker.company.companyName(),
		tradingName: defaultBody?.tradingName || faker.company.companyName(),
	}

	return enterpriseBody
}


const createEnterprise = async (defaultBody) => {
	const adminBody = makeUserBody()
	const admin = await createUser({
		isAdmin: true,
		...adminBody
	})
	const enterpriseBody = makeEnterpriseBody(defaultBody)

	const enterprise = await prisma.enterprise.create({
		data: {
			adminId: admin.id,
			...enterpriseBody
		},
	})

	return enterprise
}


const findEnterpriseById = async (id) => {
	const enterprise = await prisma.enterprise.findUnique({
		where: {
			id,
		},
	})

	return enterprise
}


export {
	makeEnterpriseBody,
	createEnterprise,
	findEnterpriseById,
}
