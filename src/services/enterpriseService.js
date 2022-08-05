import { enterpriseRepository } from '../repositories/index.js'

import { userService } from './index.js'

import { getCnpjNumbers, isValidCnpj } from '../utils/cpfCnpjValidations.js'

import {
	ExistentEnterpriseAdminError,
	ExistentEnterpriseCnpjError,
	NoEnterpriseError,
	UnprocessableCnpjError,
} from '../errors/index.js'


const findEnterprise = async () => {
	const enterprise = await findEnterpriseOrFail()

	return enterprise
}


const createEnterprise = async ({ enterprise, user }) => {
	const formattedBody = await formatCreateBodyOrFail(enterprise)

	await userService.validateAdminOrFail(user.isAdmin)
	await validateExistentEnterpriseOrFail(formattedBody.cnpj, user.id)

	const createdEnterprise = await enterpriseRepository.insert({
		adminId: user.id,
		enterpriseData: formattedBody,
	})
	
	return createdEnterprise
}


const findEnterpriseOrFail = async () => {
	const enterprise = await enterpriseRepository.findOne()
	if (!enterprise) throw new NoEnterpriseError()

	return enterprise
}

const formatCreateBodyOrFail = async (createEnterpriseBody) => {
	const { cnpj } = createEnterpriseBody
	if (!isValidCnpj(cnpj)) throw new UnprocessableCnpjError(cnpj)

	return {
		...createEnterpriseBody,
		cnpj: getCnpjNumbers(cnpj),
	}
}

const validateExistentEnterpriseOrFail = async (cnpj, adminId) => {
	await validateExistentCnpjOrFail(cnpj)
	await validateExistentEnterpriseAdminOrFail(adminId)
}

const validateExistentCnpjOrFail = async (cnpj) => {
	const existentEnterpriseCnpj = await enterpriseRepository.findByCnpj(cnpj)
	if (existentEnterpriseCnpj) throw new ExistentEnterpriseCnpjError(cnpj)
}

const validateExistentEnterpriseAdminOrFail = async (adminId) => {
	const existentEnterpriseAdmin = await enterpriseRepository
		.findByAdminId(adminId)
	if (existentEnterpriseAdmin) throw new ExistentEnterpriseAdminError(adminId)
}


export {
	findEnterprise,
	createEnterprise,
}
