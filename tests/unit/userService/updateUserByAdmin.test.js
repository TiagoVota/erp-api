import { jest } from '@jest/globals'

import { userService } from '../../../src/services/index.js'

import { userRepository } from '../../../src/repositories/index.js'

import { clearMocks } from '../../factories/jestUtilsFactory.js'
import { generateId } from '../../factories/idFactory.js'
import { makeUpdateUserBody, makeUserBody } from '../../factories/userFactory.js'

import {
	ExistentUserEmailError,
	ForbiddenAdminError,
	NoUserByIdError,
	UnprocessableCpfError,
} from '../../../src/errors/index.js'


const sut = userService

describe('userService: updateUserByAdmin', () => {
	beforeEach(clearMocks)

	it('should throw ForbiddenAdminError when the request is not made by admin', async () => {
		const requestUser = {
			id: generateId(),
			isAdmin: false,
			...makeUserBody(),
		}

		const result = sut.updateUserByAdmin({ requestUser })
		await expect(result).rejects.toThrowError(ForbiddenAdminError)
	})

	it('should throw UnprocessableCpfError for invalid cpf', async () => {
		const invalidCpf = '123.123.123-99'
		const invalidUserData = makeUpdateUserBody({ cpf: invalidCpf }, true)
		const requestUser = {
			id: generateId(),
			isAdmin: true,
			...makeUserBody(),
		}

		const result = sut.updateUserByAdmin({
			userData: invalidUserData,
			requestUser,
		})
		await expect(result).rejects.toThrowError(UnprocessableCpfError)
	})

	it('should throw NoUserByIdError when not found user with given id', async () => {
		const userId = generateId()
		const userData = makeUpdateUserBody({}, true)
		const requestUser = {
			id: generateId(),
			isAdmin: true,
			...makeUserBody(),
		}

		jest.spyOn(userRepository, 'findById')
			.mockReturnValue(null)

		const result = sut.updateUserByAdmin({ userId, userData, requestUser })
		await expect(result).rejects.toThrowError(NoUserByIdError)
	})

	it('should throw ExistentUserEmailError when the new e-mail is already used', async () => {
		const userId = generateId()
		const userData = makeUpdateUserBody()
		const requestUser = {
			id: userId,
			isAdmin: true,
			...makeUserBody(),
		}

		jest.spyOn(userRepository, 'findById')
			.mockReturnValue(requestUser)
		jest.spyOn(userRepository, 'findByEmail')
			.mockReturnValue({})

		const result = sut.updateUserByAdmin({ userId, userData, requestUser })
		await expect(result).rejects.toThrowError(ExistentUserEmailError)
	})
})
