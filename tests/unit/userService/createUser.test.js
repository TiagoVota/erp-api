import { jest } from '@jest/globals'

import { userService } from '../../../src/services/index.js'

import { userRepository } from '../../../src/repositories/index.js'

import { clearMocks } from '../../factories/jestUtilsFactory.js'
import { makeUserBody } from '../../factories/userFactory.js'

import {
	ExistentUserCpfError,
	ExistentUserEmailError,
	UnprocessableCpfError,
} from '../../../src/errors/index.js'


const sut = userService

describe('userService: createUser', () => {
	beforeEach(clearMocks)
	
	it('should throw UnprocessableCpfError for invalid cpf', async () => {
		const invalidCpf = '123.123.123-99'
		const invalidBody = makeUserBody({ cpf: invalidCpf })

		const result = sut.createUser(invalidBody)
		await expect(result).rejects.toThrowError(UnprocessableCpfError)
	})

	it('should throw ExistentUserEmailError for user with e-mail already created', async () => {
		const body = makeUserBody()

		jest.spyOn(userRepository, 'findByEmail')
			.mockReturnValue({ email: body.email })
		
		const result = sut.createUser(body)
		await expect(result).rejects.toThrowError(ExistentUserEmailError)
	})

	it('should throw ExistentUserCpfError for user with cpf already created', async () => {
		const body = makeUserBody()

		jest.spyOn(userRepository, 'findByCpf')
			.mockReturnValue({ email: body.cpf })
		
		const result = sut.createUser(body)
		await expect(result).rejects.toThrowError(ExistentUserCpfError)
	})
})
