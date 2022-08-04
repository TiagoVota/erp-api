import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'

import app from '../../src/app.js'

import { disconnectServer, truncateUsers } from '../factories/dbFactory.js'
import { findPermissionByUserId } from '../factories/permissionFactory.js'
import { findUserById, makeUserBody } from '../factories/userFactory.js'


describe('POST /admin/auth/sign-up', () => {
	beforeEach(truncateUsers)

	it('should return UNPROCESSABLE ENTITY invalid body', async () => {
		const invalidBody = makeUserBody()
		delete invalidBody.email

		const response = await supertest(app)
			.post('/admin/auth/sign-up')
			.send(invalidBody)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return CREATED for admin creation', async () => {
		const body = makeUserBody()

		const response = await supertest(app).post('/admin/auth/sign-up').send(body)

		expect(response.status).toEqual(StatusCodes.CREATED)
		expect(response.body).not.toBeNull()
		expect(response.body).toHaveProperty('user')
		expect(response.body.user).not.toHaveProperty('password')
		expect(response.body).toHaveProperty('permissions')
	})

	it('should create admin and permissions', async () => {
		const body = makeUserBody()

		const response = await supertest(app).post('/admin/auth/sign-up').send(body)
		const userId = response.body?.user?.id

		const user = await findUserById(userId)
		const permission = await findPermissionByUserId(userId)
		const haveOneNoPermission = Object.values(permission)
			.some(value => value === false)

		expect(user).not.toBeNull()
		expect(permission).not.toBeNull()
		expect(haveOneNoPermission).toBeFalsy()
	})
})


afterAll(async () => {
	await truncateUsers()
	await disconnectServer()
})
