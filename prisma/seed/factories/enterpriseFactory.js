import { faker } from '@faker-js/faker'
import { cnpj } from 'cpf-cnpj-validator'

import prisma from '../../../src/database/database.js'


const createEnterprise = async (adminId) => {
	const enterpriseData = {
		cnpj: cnpj.generate(),
		corporateName: faker.company.companyName(),
		tradingName: faker.company.companyName(),
		adminId,
	}

	const enterprise = await prisma.enterprise.create({
		data: enterpriseData,
	})

	return enterprise
}


export {
	createEnterprise,
}
