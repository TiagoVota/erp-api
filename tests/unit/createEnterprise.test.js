import { jest } from '@jest/globals'

import { enterpriseService } from '../../src/services/index.js'

import { enterpriseRepository } from '../../src/repositories/index.js'

import { makeEnterpriseBody } from '../factories/enterpriseFactory.js'
import { clearMocks } from '../factories/jestUtilsFactory.js'
import { makeUserBody } from '../factories/userFactory.js'

import {
	ExistentEnterpriseAdminError,
	ExistentEnterpriseCnpjError,
	ForbiddenAdminError,
	UnprocessableCnpjError,
} from '../../src/errors/index.js'


const sut = enterpriseService

describe('enterpriseService: createEnterprise', () => {
	beforeEach(clearMocks)
	
	it('should throw UnprocessableCnpjError for invalid cpf', async () => {
		const invalidCnpj = '11.222.333/0000-99'
		const invalidBody = makeEnterpriseBody({ cnpj: invalidCnpj })

		const result = sut.createEnterprise({ enterprise: invalidBody })
		await expect(result).rejects.toThrowError(UnprocessableCnpjError)
	})

	it('should throw ForbiddenAdminError for no admin request', async () => {
		const enterprise = makeEnterpriseBody()
		const user = makeUserBody()
		
		const result = sut.createEnterprise({ enterprise, user })
		await expect(result).rejects.toThrowError(ForbiddenAdminError)
	})

	it('should throw ExistentEnterpriseCnpjError for enterprise with cnpj already created', async () => {
		const enterprise = makeEnterpriseBody()
		const admin = {
			...makeUserBody(),
			isAdmin: true,
		}

		jest.spyOn(enterpriseRepository, 'findByCnpj')
			.mockReturnValue({ cnpj: enterprise.cnpj })
		
		const result = sut.createEnterprise({ enterprise, user: admin })
		await expect(result).rejects.toThrowError(ExistentEnterpriseCnpjError)
	})

	it('should throw ExistentEnterpriseAdminError for admin with a enterprise already created', async () => {
		const enterprise = makeEnterpriseBody()
		const admin = {
			...makeUserBody(),
			isAdmin: true,
		}

		jest.spyOn(enterpriseRepository, 'findByCnpj')
			.mockReturnValue(null)
		jest.spyOn(enterpriseRepository, 'findByAdminId')
			.mockReturnValue(admin)
		
		const result = sut.createEnterprise({ enterprise, user: admin })
		await expect(result).rejects.toThrowError(ExistentEnterpriseAdminError)
	})
})
