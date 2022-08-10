import { jest } from '@jest/globals'
import bcrypt from 'bcrypt'

import { userService } from '../../../src/services/index.js'

import { userRepository } from '../../../src/repositories/index.js'

import { clearMocks } from '../../factories/jestUtilsFactory.js'
import { generateId } from '../../factories/idFactory.js'

import {
	ForbiddenAdminDeleteError,
	NoUserByIdError,
} from '../../../src/errors/index.js'


const sut = userService

describe('userService: removeUser', () => {
	beforeEach(clearMocks)
	
	it('should throw NoUserByIdError when not found user with given id', async () => {
		const userId = generateId()

		jest.spyOn(userRepository, 'findById')
			.mockReturnValue(null)

		const result = sut.removeUser({ userId })
		await expect(result).rejects.toThrowError(NoUserByIdError)
	})

	it('should throw ForbiddenAdminDeleteError when try to delete admin', async () => {
		const userId = generateId()

		jest.spyOn(userRepository, 'findById')
			.mockReturnValue({ userId, isAdmin: true })

		const result = sut.removeUser({ userId })
		await expect(result).rejects.toThrowError(ForbiddenAdminDeleteError)
	})
})
