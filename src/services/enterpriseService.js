import { enterpriseRepository } from '../repositories/index.js'

import { userService } from './index.js'

import { getCnpjNumbers, isValidCnpj } from '../utils/cpfCnpjValidations.js'

import {
	ExistentEnterpriseAdminError,
	ExistentEnterpriseCnpjError,
	NoEnterpriseAdminError,
	NoEnterpriseError,
	UnprocessableCnpjError,
} from '../errors/index.js'


const findEnterprise = async () => {
	const enterprise = await findEnterpriseOrFail()

	return enterprise
}


const createEnterprise = async ({ enterprise, user }) => {
	const formattedBody = await formatBodyOrFail(enterprise)

	await userService.validateAdminOrFail(user.isAdmin)
	await validateExistentEnterpriseOrFail(formattedBody.cnpj, user.id)

	const createdEnterprise = await enterpriseRepository.insert({
		adminId: user.id,
		enterpriseData: formattedBody,
	})
	
	return createdEnterprise
}


const updateEnterprise = async ({ enterprise, user }) => {
	const formattedBody = await formatBodyOrFail(enterprise)

	await userService.validateAdminOrFail(user.isAdmin)
	await validateExistentUpdateEnterpriseOrFail(formattedBody.cnpj, user.id)

	const updatedEnterprise = await enterpriseRepository.update({
		adminId: user.id,
		enterpriseData: formattedBody,
	})

	return updatedEnterprise
}


const findEnterpriseOrFail = async () => {
	const enterprise = await enterpriseRepository.findOne()
	if (!enterprise) throw new NoEnterpriseError()

	return enterprise
}

const formatBodyOrFail = async (createEnterpriseBody) => {
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

const validateExistentUpdateEnterpriseOrFail = async (cnpj, adminId) => {
	const oldEnterpriseData = await validateEnterpriseOrFail(adminId)

	const haveSameCnpj = Boolean(oldEnterpriseData.cnpj === cnpj)
	if (!haveSameCnpj) await validateExistentCnpjOrFail(cnpj)
}

const validateEnterpriseOrFail = async (adminId) => {
	const enterprise = await enterpriseRepository.findByAdminId(adminId)
	if (!enterprise) throw new NoEnterpriseAdminError(adminId)

	return enterprise
}


export {
	findEnterprise,
	createEnterprise,
	updateEnterprise,
}
