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

describe('transactionService: updateTransaction', () => {
	beforeEach(clearMocks)
	
	it('should throw UnprocessableDateError for invalid writeOffDate date', async () => {
		const invalidDate = 'invalid date'
		const transactionData = makeUpdateTransactionBody({
			writeOffDate: invalidDate,
		})

		const result = sut.updateTransaction({ transactionData })
		await expect(result).rejects.toThrowError(UnprocessableDateError)
	})

	it('should throw UnprocessableDateError for invalid createdAt date', async () => {
		const invalidDate = 'invalid date'
		const transactionData = makeUpdateTransactionBody({
			createdAt: invalidDate,
		})

		const result = sut.updateTransaction({ transactionData })
		await expect(result).rejects.toThrowError(UnprocessableDateError)
	})

	it('should throw NoTransactionByIdError for not found transaction', async () => {
		const transactionId = generateId()
		const transactionData = makeUpdateTransactionBody()

		jest.spyOn(transactionRepository, 'findById')
			.mockReturnValueOnce(null)

		const result = sut.updateTransaction({ transactionData, transactionId })
		await expect(result).rejects.toThrowError(NoTransactionByIdError)
	})
})
