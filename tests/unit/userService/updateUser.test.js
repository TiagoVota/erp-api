import { jest } from '@jest/globals'

import { userService } from '../../../src/services/index.js'

import { userRepository } from '../../../src/repositories/index.js'

import { clearMocks } from '../../factories/jestUtilsFactory.js'
import { generateId } from '../../factories/idFactory.js'
import { makeUpdateUserBody, makeUserBody } from '../../factories/userFactory.js'

import {
	ExistentUserEmailError,
	ForbiddenUserAction,
	NoUserByIdError,
} from '../../../src/errors/index.js'


const sut = userService

describe('userService: updateUser', () => {
	beforeEach(clearMocks)
	
	it('should throw NoUserByIdError when not found user with given id', async () => {
		const userId = generateId()
		const userData = makeUpdateUserBody()

		jest.spyOn(userRepository, 'findById')
			.mockReturnValue(null)

		const result = sut.updateUser({ userId, userData })
		await expect(result).rejects.toThrowError(NoUserByIdError)
	})

	it('should throw ForbiddenUserAction when the request is made by other user', async () => {
		const userId = generateId()
		const userData = makeUpdateUserBody()
		const requestUser = {
			id: generateId(),
			...makeUserBody(),
		}

		jest.spyOn(userRepository, 'findById')
			.mockReturnValue({})

		const result = sut.updateUser({ userId, userData, requestUser })
		await expect(result).rejects.toThrowError(ForbiddenUserAction)
	})

	it('should throw ExistentUserEmailError when the new e-mail is already used', async () => {
		const userId = generateId()
		const userData = makeUpdateUserBody()
		const requestUser = {
			id: userId,
			...makeUserBody(),
		}

		jest.spyOn(userRepository, 'findById')
			.mockReturnValue(requestUser)
		jest.spyOn(userRepository, 'findByEmail')
			.mockReturnValue({})

		const result = sut.updateUser({ userId, userData, requestUser })
		await expect(result).rejects.toThrowError(ExistentUserEmailError)
	})
})
