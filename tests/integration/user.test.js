import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'

import app from '../../src/app.js'

import { disconnectServer, cleanDb } from '../factories/dbFactory.js'
import { generateValidToken } from '../factories/tokenFactory.js'
import { createUserPermissions } from '../factories/permissionFactory.js'
import { createUser } from '../factories/userFactory.js'
import { generateId } from '../factories/idFactory.js'


describe('get /users', () => {
	beforeEach(cleanDb)

	it('should return UNAUTHORIZED when no token is given', async () => {
		const response = await supertest(app)
			.get('/users')
			.set('Authorization', `Bearer ${undefined}`)

		expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
	})

	it('should return FORBIDDEN when not allowed user make the request given', async () => {
		const notAllowedUser = await createUser()
		await createUserPermissions(notAllowedUser.id)

		const token = await generateValidToken({ defaultUser: notAllowedUser })

		const response = await supertest(app)
			.get('/users')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.FORBIDDEN)
	})

	it('should return UNPROCESSABLE ENTITY invalid query params', async () => {
		const allowedUser = await createUser()
		await createUserPermissions(allowedUser.id, 'seeUsers')
		const invalidLimit = 'invalid limit'

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.get(`/users?limit=${invalidLimit}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return OK when return users list', async () => {
		const allowedUser = await createUser()
		await createUserPermissions(allowedUser.id, 'seeUsers')

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.get('/users')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.OK)
		expect(response.body).not.toBeNull()
		expect(response.body.length).toBeGreaterThanOrEqual(1)
		expect(response.body[0]).toHaveProperty('permissions')
	})
})

describe('GET /users/:userId', () => {
	beforeEach(cleanDb)

	it('should return UNAUTHORIZED when no token is given', async () => {
		const userId = generateId()

		const response = await supertest(app)
			.get(`/users/${userId}`)

		expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
	})

	it('should return UNPROCESSABLE ENTITY invalid params', async () => {
		const invalidUserId = 'invalid user id'
		const allowedUser = await createUser()

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.get(`/users/${invalidUserId}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return OK when return user info', async () => {
		const user = await createUser()
		await createUserPermissions(user.id)

		const token = await generateValidToken({ defaultUser: user })

		const response = await supertest(app)
			.get(`/users/${user.id}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.OK)
		expect(response.body).not.toBeNull()
		expect(response.body).toHaveProperty('id')
	})

	it('should return user permissions when allowed user make request', async () => {
		const allowedUser = await createUser()
		const user = await createUser()
		await createUserPermissions(allowedUser.id, 'seeUsers')

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.get(`/users/${user.id}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.body).toHaveProperty('permissions')
	})

	it('should not return user permissions when not allowed user make request', async () => {
		const notAllowedUser = await createUser()
		const user = await createUser()
		await createUserPermissions(notAllowedUser.id)

		const token = await generateValidToken({ defaultUser: notAllowedUser })

		const response = await supertest(app)
			.get(`/users/${user.id}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.body).not.toHaveProperty('permissions')
	})
})


afterAll(async () => {
	await cleanDb()
	await disconnectServer()
})
