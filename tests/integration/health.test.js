import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'

import app from '../../src/app.js'

import { disconnectServer, truncateHealth } from '../factories/dbFactory.js'


describe('GET /health', () => {
	beforeEach(truncateHealth)

	it('should verify if tests are alive', () => {
		expect(1).toEqual(1)
	})

	it('should return OK for server alive', async () => {
		const response = await supertest(app).get('/health')

		expect(response.status).toEqual(StatusCodes.OK)
		expect(response.body).not.toBeNull()
	})
})


afterAll(async () => {
	await truncateHealth()
	await disconnectServer()
})
