import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'

import app from '../../src/app.js'

import { disconnectServer, cleanDb } from '../factories/dbFactory.js'
import { generateValidToken } from '../factories/tokenFactory.js'
import { createUserPermissions } from '../factories/permissionFactory.js'
import { createUser } from '../factories/userFactory.js'
import {
	findTransactionById,
	makeTransactionBody,
} from '../factories/transactionFactory.js'


describe('PUT /transactions', () => {
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


afterAll(async () => {
	await cleanDb()
	await disconnectServer()
})
