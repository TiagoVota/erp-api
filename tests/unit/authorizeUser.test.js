import { jest } from '@jest/globals'
import bcrypt from 'bcrypt'

import { userService } from '../../src/services/index.js'

import { userRepository } from '../../src/repositories/index.js'

import { clearMocks } from '../factories/jestUtilsFactory.js'
import { makeUserLoginBody } from '../factories/userFactory.js'
import { generateId } from '../factories/idFactory.js'

import {
	InvalidPasswordError,
	NoUserError,
} from '../../src/errors/index.js'


const sut = userService

describe('userService: authorizeUser', () => {
	beforeEach(clearMocks)
	
	it('should throw NoUserError for no user registered', async () => {
		const loginBody = makeUserLoginBody()

		jest.spyOn(userRepository, 'findByEmail')
			.mockReturnValue(null)

		const result = sut.authorizeUser(loginBody)
		await expect(result).rejects.toThrowError(NoUserError)
	})

	it('should throw InvalidPasswordError for wrong password', async () => {
		const loginBody = makeUserLoginBody()

		jest.spyOn(userRepository, 'findByEmail')
			.mockReturnValue({ id: generateId() })
		jest.spyOn(bcrypt, 'compareSync')
			.mockReturnValue(false)
		
		const result = sut.authorizeUser(loginBody)
		await expect(result).rejects.toThrowError(InvalidPasswordError)
	})
})
