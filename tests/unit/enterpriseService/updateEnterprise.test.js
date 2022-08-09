import { jest } from '@jest/globals'

import { enterpriseService } from '../../../src/services/index.js'

import { enterpriseRepository } from '../../../src/repositories/index.js'

import { makeEnterpriseBody } from '../../factories/enterpriseFactory.js'
import { clearMocks } from '../../factories/jestUtilsFactory.js'
import { makeUserBody } from '../../factories/userFactory.js'

import {
	ExistentEnterpriseAdminError,
	ExistentEnterpriseCnpjError,
	ForbiddenAdminError,
	NoEnterpriseAdminError,
	UnprocessableCnpjError,
} from '../../../src/errors/index.js'


const sut = enterpriseService

describe('enterpriseService: updateEnterprise', () => {
	beforeEach(clearMocks)
	
	it('should throw UnprocessableCnpjError for invalid cpf', async () => {
		const invalidCnpj = '11.222.333/0000-99'
		const invalidBody = makeEnterpriseBody({ cnpj: invalidCnpj })

		const result = sut.updateEnterprise({ enterprise: invalidBody })
		await expect(result).rejects.toThrowError(UnprocessableCnpjError)
	})

	it('should throw ForbiddenAdminError for no admin request', async () => {
		const enterprise = makeEnterpriseBody()
		const user = makeUserBody()
		
		const result = sut.updateEnterprise({ enterprise, user })
		await expect(result).rejects.toThrowError(ForbiddenAdminError)
	})

	it('should throw NoEnterpriseAdminError for enterprise with cnpj already created', async () => {
		const enterprise = makeEnterpriseBody()
		const admin = {
			...makeUserBody(),
			isAdmin: true,
		}

		jest.spyOn(enterpriseRepository, 'findByAdminId')
			.mockReturnValue(null)
		
		const result = sut.updateEnterprise({ enterprise, user: admin })
		await expect(result).rejects.toThrowError(NoEnterpriseAdminError)
	})

	it('should throw ExistentEnterpriseCnpjError for admin with a enterprise already created', async () => {
		const enterprise = makeEnterpriseBody()
		const otherEnterprise = makeEnterpriseBody()
		const newEnterpriseData = makeEnterpriseBody({ cnpj: otherEnterprise.cnpj })
		const admin = {
			...makeUserBody(),
			isAdmin: true,
		}

		jest.spyOn(enterpriseRepository, 'findByAdminId')
			.mockReturnValue({ adminId: admin.id, ...enterprise })
		jest.spyOn(enterpriseRepository, 'findByCnpj')
			.mockReturnValue({ adminId: admin.id + 1, ...otherEnterprise })
		
		const result = sut.updateEnterprise({
			enterprise: newEnterpriseData,
			user: admin,
		})
		await expect(result).rejects.toThrowError(ExistentEnterpriseCnpjError)
	})
})
