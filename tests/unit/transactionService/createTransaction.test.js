import { jest } from '@jest/globals'

import { transactionService } from '../../../src/services/index.js'

import { userRepository } from '../../../src/repositories/index.js'

import { clearMocks } from '../../factories/jestUtilsFactory.js'
import { generateId } from '../../factories/idFactory.js'
import { makeTransactionBody } from '../../factories/transactionFactory.js'

import {
	ConflictSameUserTransactionError,
	ForbiddenNoAdminTransactionError,
	NoUserByIdError,
	UnprocessableDateError,
} from '../../../src/errors/index.js'


const sut = transactionService

describe('transactionService: createTransaction', () => {
	beforeEach(clearMocks)
	
	it('should throw UnprocessableDateError for invalid writeOffDate date', async () => {
		const invalidDate = 'invalid date'
		const transactionBody = makeTransactionBody({
			writeOffDate: invalidDate,
		})

		const result = sut.createTransaction(transactionBody)
		await expect(result).rejects.toThrowError(UnprocessableDateError)
	})

	it('should throw UnprocessableDateError for invalid createdAt date', async () => {
		const invalidDate = 'invalid date'
		const transactionBody = makeTransactionBody({
			createdAt: invalidDate,
		})

		const result = sut.createTransaction(transactionBody)
		await expect(result).rejects.toThrowError(UnprocessableDateError)
	})

	it('should throw NoUserByIdError for not found payer', async () => {
		const transactionBody = makeTransactionBody()

		jest.spyOn(userRepository, 'findById')
			.mockReturnValueOnce(null)

		const result = sut.createTransaction(transactionBody)
		await expect(result).rejects.toThrowError(NoUserByIdError)
	})

	it('should throw NoUserByIdError for not found payee', async () => {
		const transactionBody = makeTransactionBody()

		jest.spyOn(userRepository, 'findById')
			.mockReturnValueOnce({})
		jest.spyOn(userRepository, 'findById')
			.mockReturnValueOnce(null)

		const result = sut.createTransaction(transactionBody)
		await expect(result).rejects.toThrowError(NoUserByIdError)
	})

	it('should throw ConflictSameUserTransactionError for same payer and payee', async () => {
		const sameUserId = generateId()
		const transactionBody = makeTransactionBody()

		jest.spyOn(userRepository, 'findById')
			.mockReturnValueOnce({ id: sameUserId })
		jest.spyOn(userRepository, 'findById')
			.mockReturnValueOnce({ id: sameUserId })

		const result = sut.createTransaction(transactionBody)
		await expect(result).rejects.toThrowError(ConflictSameUserTransactionError)
	})

	it('should throw ForbiddenNoAdminTransactionError for no enterprise admin in transaction', async () => {
		const userId = generateId()
		const transactionBody = makeTransactionBody()

		jest.spyOn(userRepository, 'findById')
			.mockReturnValueOnce({ id: userId })
		jest.spyOn(userRepository, 'findById')
			.mockReturnValueOnce({ id: userId + 1 })

		const result = sut.createTransaction(transactionBody)
		await expect(result).rejects.toThrowError(ForbiddenNoAdminTransactionError)
	})
})
