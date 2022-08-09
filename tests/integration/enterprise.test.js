import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'

import app from '../../src/app.js'

import { disconnectServer, cleanDb } from '../factories/dbFactory.js'
import { createEnterprise } from '../factories/enterpriseFactory.js'
import { generateValidToken } from '../factories/tokenFactory.js'


describe('GET /enterprises', () => {
	beforeEach(cleanDb)

	it('should return UNAUTHORIZED when no token is given', async () => {
		const response = await supertest(app)
			.get('/enterprises')
			.set('Authorization', `Bearer ${undefined}`)

		expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
	})

	it('should return OK when get enterprise', async () => {
		const token = await generateValidToken()
		await createEnterprise()
		
		const response = await supertest(app)
			.get('/enterprises')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.OK)
		expect(response.body).not.toBeNull()
	})
})


afterAll(async () => {
	await cleanDb()
	await disconnectServer()
})
