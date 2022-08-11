import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'

import app from '../../src/app.js'

import { disconnectServer, cleanDb } from '../factories/dbFactory.js'
import { generateValidToken } from '../factories/tokenFactory.js'
import { createUserPermissions } from '../factories/permissionFactory.js'
import { createUser } from '../factories/userFactory.js'
import {
	createTransaction,
	findTransactionById,
	makeTransactionBody,
	makeUpdateTransactionBody,
} from '../factories/transactionFactory.js'
import { generateId } from '../factories/idFactory.js'


describe('GET /transactions', () => {
	beforeEach(cleanDb)

	it('should return UNAUTHORIZED when no token is given', async () => {
		const response = await supertest(app)
			.get('/transactions')

		expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
	})

	it('should return FORBIDDEN when not allowed user make the request', async () => {
		const notAllowedUser = await createUser()
		await createUserPermissions(notAllowedUser.id)

		const token = await generateValidToken({ defaultUser: notAllowedUser })

		const response = await supertest(app)
			.get('/transactions')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.FORBIDDEN)
	})

	it('should return UNPROCESSABLE ENTITY for invalid query params', async () => {
		const allowedUser = await createUser()
		await createUserPermissions(allowedUser.id, 'seeTransactions')
		const invalidLimit = 'invalid limit'

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.get(`/transactions?limit=${invalidLimit}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return OK when return transactions', async () => {
		const allowedUser = await createUser()
		await createTransaction()
		await createUserPermissions(allowedUser.id, 'seeTransactions')

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.get('/transactions')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.OK)
		expect(response.body).not.toBeNull()
		expect(response.body.length).toBeGreaterThan(0)
		expect(response.body[0]).toHaveProperty('id')
	})

	it('should return payer and payee info when allowed user make request', async () => {
		const allowedUser = await createUser()
		await createTransaction()
		await createUserPermissions(allowedUser.id, 'seeTransactions', 'seeUsers')

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.get('/transactions')
			.set('Authorization', `Bearer ${token}`)

		expect(response.body[0]).toHaveProperty('payer')
		expect(response.body[0]).toHaveProperty('payee')
	})

	it('should not return payer and payee info when not allowed user make request', async () => {
		const allowedUser = await createUser()
		await createTransaction()
		await createUserPermissions(allowedUser.id, 'seeTransactions')

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.get('/transactions')
			.set('Authorization', `Bearer ${token}`)

		expect(response.body[0]).not.toHaveProperty('payer')
		expect(response.body[0]).not.toHaveProperty('payee')
	})
})

describe('POST /transactions', () => {
	beforeEach(cleanDb)

	it('should return UNAUTHORIZED when no token is given', async () => {
		const response = await supertest(app)
			.post('/transactions')

		expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
	})

	it('should return FORBIDDEN when not allowed user make the request', async () => {
		const notAllowedUser = await createUser()
		await createUserPermissions(notAllowedUser.id)

		const token = await generateValidToken({ defaultUser: notAllowedUser })

		const response = await supertest(app)
			.post('/transactions')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.FORBIDDEN)
	})

	it('should return UNPROCESSABLE ENTITY for invalid body', async () => {
		const allowedUser = await createUser()
		await createUserPermissions(allowedUser.id, 'addTransactions')
		const invalidBody = makeTransactionBody()
		delete invalidBody.value

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.post('/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(invalidBody)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return CREATED when create transaction', async () => {
		const createUserPromises = [
			createUser({ isAdmin: true }),
			createUser(),
			createUser(),
		]
		const [ admin, user, allowedUser ] = await Promise.all(createUserPromises)
		await createUserPermissions(allowedUser.id, 'addTransactions')
		const body = makeTransactionBody({ payerId: admin.id, payeeId: user.id })

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.post('/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(body)

		expect(response.status).toEqual(StatusCodes.CREATED)
	})

	it('should update user permissions in database', async () => {
		const createUserPromises = [
			createUser({ isAdmin: true }),
			createUser(),
			createUser(),
		]
		const [ admin, user, allowedUser ] = await Promise.all(createUserPromises)
		await createUserPermissions(allowedUser.id, 'addTransactions')
		const body = makeTransactionBody({
			payerId: admin.id,
			payeeId: user.id,
		})

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.post('/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send(body)
		const createdId = response.body.id

		const createdTransaction = await findTransactionById(createdId)

		expect(createdTransaction).not.toBeNull()
		expect(createdTransaction.value).toEqual(body.value)
	})
})

describe('PUT /transactions/:transactionId', () => {
	beforeEach(cleanDb)

	it('should return UNAUTHORIZED when no token is given', async () => {
		const transactionId = generateId()

		const response = await supertest(app)
			.put(`/transactions/${transactionId}`)
			.set('Authorization', `Bearer ${undefined}`)

		expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
	})

	it('should return FORBIDDEN when not allowed user make the request given', async () => {
		const transactionId = generateId()
		const notAllowedUser = await createUser()
		await createUserPermissions(notAllowedUser.id)

		const token = await generateValidToken({ defaultUser: notAllowedUser })

		const response = await supertest(app)
			.put(`/transactions/${transactionId}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.FORBIDDEN)
	})

	it('should return UNPROCESSABLE ENTITY for invalid params', async () => {
		const invalidTransactionId = 'invalid transactionId'
		const allowedUser = await createUser()
		await createUserPermissions(allowedUser.id, 'editTransactions')

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.put(`/transactions/${invalidTransactionId}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return UNPROCESSABLE ENTITY for invalid body', async () => {
		const transactionId = generateId()
		const allowedUser = await createUser()
		await createUserPermissions(allowedUser.id, 'editTransactions')
		const invalidBody = makeUpdateTransactionBody()
		delete invalidBody.value

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.put(`/transactions/${transactionId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(invalidBody)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return OK when update transaction', async () => {
		const transaction = await createTransaction()
		const allowedUser = await createUser()
		await createUserPermissions(allowedUser.id, 'editTransactions')
		const body = makeUpdateTransactionBody()

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.put(`/transactions/${transaction.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body)

		expect(response.status).toEqual(StatusCodes.OK)
	})

	it('should update transaction in database', async () => {
		const transaction = await createTransaction()
		const allowedUser = await createUser()
		await createUserPermissions(allowedUser.id, 'editTransactions')
		const body = makeUpdateTransactionBody()

		const token = await generateValidToken({ defaultUser: allowedUser })

		await supertest(app)
			.put(`/transactions/${transaction.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body)

		const updatedTransaction = await findTransactionById(transaction.id)

		expect(updatedTransaction).not.toBeNull()
		expect(updatedTransaction.value).toEqual(body.value)
	})
})


afterAll(async () => {
	await cleanDb()
	await disconnectServer()
})
