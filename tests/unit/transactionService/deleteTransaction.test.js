import { jest } from '@jest/globals'

import { transactionService } from '../../../src/services/index.js'

import { transactionRepository } from '../../../src/repositories/index.js'

import { clearMocks } from '../../factories/jestUtilsFactory.js'
import { generateId } from '../../factories/idFactory.js'
import {
	makeUpdateTransactionBody,
} from '../../factories/transactionFactory.js'

import {
	NoTransactionByIdError,
	UnprocessableDateError,
} from '../../../src/errors/index.js'


const sut = transactionService

describe('transactionService: deleteTransaction', () => {
	beforeEach(clearMocks)

	it('should throw NoTransactionByIdError for not found transaction', async () => {
		const transactionId = generateId()

		jest.spyOn(transactionRepository, 'findById')
			.mockReturnValueOnce(null)

		const result = sut.deleteTransaction({ transactionId })
		await expect(result).rejects.toThrowError(NoTransactionByIdError)
	})
})
