import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'

import app from '../../src/app.js'

import { disconnectServer, truncateUsers } from '../factories/dbFactory.js'
import { createUser, makeUserLoginBody } from '../factories/userFactory.js'

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


afterAll(async () => {
	await disconnectServer()
	await truncateUsers()
})
