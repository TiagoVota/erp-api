import { jest } from '@jest/globals'

import { enterpriseService } from '../../../src/services/index.js'

import { enterpriseRepository } from '../../../src/repositories/index.js'

import { clearMocks } from '../../factories/jestUtilsFactory.js'

import { NoEnterpriseError } from '../../../src/errors/index.js'


const sut = enterpriseService

describe('enterpriseService: findEnterprise', () => {
	beforeEach(clearMocks)
	
	it('should throw NoEnterpriseError when does not have a registered enterprise', async () => {
		jest.spyOn(enterpriseRepository, 'findOne')
			.mockReturnValue(null)
		
		const result = sut.findEnterprise()
		await expect(result).rejects.toThrowError(NoEnterpriseError)
	})
})
