import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'

import app from '../../src/app.js'

import { disconnectServer, truncateUsers } from '../factories/dbFactory.js'
import { generateValidToken } from '../factories/tokenFactory.js'
import {
	createUserPermissions,
	findPermissionByUserId
} from '../factories/permissionFactory.js'
import {
	createUser,
	findUserById,
	makeUserBody,
	makeUserLoginBody,
} from '../factories/userFactory.js'


describe('POST /auth/login', () => {
	beforeEach(truncateUsers)

	it('should return UNPROCESSABLE ENTITY invalid body', async () => {
		const invalidBody = makeUserLoginBody()
		delete invalidBody.password

		const response = await supertest(app)
			.post('/auth/login')
			.send(invalidBody)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return OK for user auth and send user token', async () => {
		const userPassword = 'password'
		const user = await createUser({ password: userPassword })

		const loginBody = {
			email: user.email,
			password: userPassword,
		}

		const response = await supertest(app).post('/auth/login').send(loginBody)

		expect(response.status).toEqual(StatusCodes.OK)
		expect(response.body).toHaveProperty('token')
	})
})

describe('POST /auth/sign-up', () => {
	beforeEach(truncateUsers)

	it('should return UNAUTHORIZED when no token is given', async () => {
		const body = makeUserBody()

		const response = await supertest(app)
			.post('/auth/sign-up')
			.set('Authorization', `Bearer ${undefined}`)
			.send(body)

		expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
	})

	it('should return FORBIDDEN when not allowed user make the request given', async () => {
		const notAllowedUser = await createUser()
		await createUserPermissions(notAllowedUser.id)

		const token = await generateValidToken({ defaultUser: notAllowedUser })
		const body = makeUserBody()

		const response = await supertest(app)
			.post('/auth/sign-up')
			.set('Authorization', `Bearer ${token}`)
			.send(body)

		expect(response.status).toEqual(StatusCodes.FORBIDDEN)
	})

	it('should return UNPROCESSABLE ENTITY invalid body', async () => {
		const allowedUser = await createUser()
		await createUserPermissions(allowedUser.id, 'addUsers')

		const token = await generateValidToken({ defaultUser: allowedUser })
		const invalidBody = makeUserBody()
		delete invalidBody.password

		const response = await supertest(app)
			.post('/auth/sign-up')
			.set('Authorization', `Bearer ${token}`)
			.send(invalidBody)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return CREATED when create user', async () => {
		const allowedUser = await createUser()
		await createUserPermissions(allowedUser.id, 'addUsers')

		const token = await generateValidToken({ defaultUser: allowedUser })
		const body = makeUserBody()

		const response = await supertest(app)
			.post('/auth/sign-up')
			.set('Authorization', `Bearer ${token}`)
			.send(body)

		expect(response.status).toEqual(StatusCodes.CREATED)
		expect(response.body).not.toBeNull()
		expect(response.body).toHaveProperty('user')
		expect(response.body.user).not.toHaveProperty('password')
		expect(response.body).toHaveProperty('permissions')
	})

	it('should create user and permissions', async () => {
		const allowedUser = await createUser()
		await createUserPermissions(allowedUser.id, 'addUsers')

		const token = await generateValidToken({ defaultUser: allowedUser })
		const body = makeUserBody()

		const response = await supertest(app)
			.post('/auth/sign-up')
			.set('Authorization', `Bearer ${token}`)
			.send(body)
		const userId = response.body?.user?.id

		const user = await findUserById(userId)
		const permission = await findPermissionByUserId(userId)

		expect(user).not.toBeNull()
		expect(user.isAdmin).toBeFalsy()
		expect(permission).not.toBeNull()
	})
})


afterAll(async () => {
	await truncateUsers()
	await disconnectServer()
})
