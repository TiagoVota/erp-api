import { jest } from '@jest/globals'

import { userService } from '../../src/services/index.js'

import { userRepository } from '../../src/repositories/index.js'

import { clearMocks } from '../factories/jestUtilsFactory.js'
import { makeUserBody } from '../factories/userFactory.js'

import {
	ExistentAdminError,
	ExistentUserError,
	UnprocessableCpfError,
} from '../../src/errors/index.js'


const sut = userService

describe('userService: createAdmin', () => {
	beforeEach(clearMocks)
	
	it('should throw UnprocessableCpfError for invalid cpf', async () => {
		const invalidCpf = '123.123.123-99'
		const invalidBody = makeUserBody({ cpf: invalidCpf })

		const result = sut.createAdmin(invalidBody)
		await expect(result).rejects.toThrowError(UnprocessableCpfError)
	})

	it('should throw ExistentAdminError for admin already created', async () => {
		const body = makeUserBody()

		jest.spyOn(userRepository, 'findAdmin')
			.mockReturnValue({})
		
		const result = sut.createAdmin(body)
		await expect(result).rejects.toThrowError(ExistentAdminError)
	})

	it('should throw ExistentUserError for user with e-mail already created', async () => {
		const body = makeUserBody()

		jest.spyOn(userRepository, 'findByEmail')
			.mockReturnValue({ email: body.email })
		
		const result = sut.createAdmin(body)
		await expect(result).rejects.toThrowError(ExistentUserError)
	})
})
