import { jest } from '@jest/globals'

import { permissionService } from '../../../src/services/index.js'

import { userRepository } from '../../../src/repositories/index.js'

import { clearMocks } from '../../factories/jestUtilsFactory.js'
import { generateId } from '../../factories/idFactory.js'
import { makePermissionsOptions } from '../../factories/permissionFactory.js'

import { NoUserByIdError } from '../../../src/errors/index.js'


const sut = permissionService

describe('permissionService: updateUserPermissions', () => {
	beforeEach(clearMocks)
	
	it('should throw NoUserByIdError for not found given user id', async () => {
		const invalidUserId = generateId()
		const permissionsData = makePermissionsOptions()

		jest.spyOn(userRepository, 'findById')
			.mockReturnValue(null)

		const result = sut.updateUserPermissions({
			userId: invalidUserId,
			permissionsData,
		})
		await expect(result).rejects.toThrowError(NoUserByIdError)
	})
})
