import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'

import app from '../../src/app.js'

import { cleanDb, disconnectServer } from '../factories/dbFactory.js'
import {
	createEnterprise,
	findEnterpriseById,
	makeEnterpriseBody,
} from '../factories/enterpriseFactory.js'
import { findPermissionByUserId } from '../factories/permissionFactory.js'
import { generateValidToken } from '../factories/tokenFactory.js'
import {
	createUser,
	findUserById,
	makeUserBody,
} from '../factories/userFactory.js'


describe('POST /admin/auth/sign-up', () => {
	beforeEach(cleanDb)

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

describe('POST /admin/enterprise', () => {
	beforeEach(cleanDb)

	it('should return UNAUTHORIZED when no token is given', async () => {
		const body = makeEnterpriseBody()

		const response = await supertest(app)
			.post('/admin/enterprise')
			.send(body)

		expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
	})

	it('should return UNPROCESSABLE ENTITY when invalid body is given', async () => {
		const admin = await createUser({ isAdmin: true })

		const token = await generateValidToken({ defaultUser: admin })
		const invalidBody = makeEnterpriseBody()
		delete invalidBody.cnpj

		const response = await supertest(app)
			.post('/admin/enterprise')
			.set('Authorization', `Bearer ${token}`)
			.send(invalidBody)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return CREATED when create enterprise', async () => {
		const admin = await createUser({ isAdmin: true })

		const token = await generateValidToken({ defaultUser: admin })
		const body = makeEnterpriseBody()

		const response = await supertest(app)
			.post('/admin/enterprise')
			.set('Authorization', `Bearer ${token}`)
			.send(body)

		expect(response.status).toEqual(StatusCodes.CREATED)
		expect(response.body).not.toBeNull()
		expect(response.body).toHaveProperty('cnpj')
	})

	it('should create enterprise in database', async () => {
		const admin = await createUser({ isAdmin: true })

		const token = await generateValidToken({ defaultUser: admin })
		const body = makeEnterpriseBody()

		const response = await supertest(app)
			.post('/admin/enterprise')
			.set('Authorization', `Bearer ${token}`)
			.send(body)
		const enterpriseId = response.body?.id

		const enterprise = await findEnterpriseById(enterpriseId)

		expect(enterprise).not.toBeNull()
	})
})

describe('PUT /admin/enterprise', () => {
	beforeEach(cleanDb)

	it('should return UNAUTHORIZED when no token is given', async () => {
		const body = makeEnterpriseBody()

		const response = await supertest(app)
			.put('/admin/enterprise')
			.send(body)

		expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
	})

	it('should return UNPROCESSABLE ENTITY when invalid body is given', async () => {
		const admin = await createUser({ isAdmin: true })

		const token = await generateValidToken({ defaultUser: admin })
		const invalidBody = makeEnterpriseBody()
		delete invalidBody.cnpj

		const response = await supertest(app)
			.put('/admin/enterprise')
			.set('Authorization', `Bearer ${token}`)
			.send(invalidBody)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return OK when create enterprise', async () => {
		const { admin } = await createEnterprise()

		const token = await generateValidToken({ defaultUser: admin })
		const body = makeEnterpriseBody()

		const response = await supertest(app)
			.put('/admin/enterprise')
			.set('Authorization', `Bearer ${token}`)
			.send(body)

		expect(response.status).toEqual(StatusCodes.OK)
		expect(response.body).not.toBeNull()
		expect(response.body).toHaveProperty('cnpj')
	})

	it('should create enterprise in database', async () => {
		const { admin } = await createEnterprise()

		const token = await generateValidToken({ defaultUser: admin })
		const body = makeEnterpriseBody()

		const response = await supertest(app)
			.put('/admin/enterprise')
			.set('Authorization', `Bearer ${token}`)
			.send(body)
		const enterpriseId = response.body?.id

		const enterprise = await findEnterpriseById(enterpriseId)

		expect(enterprise).not.toBeNull()
		expect(enterprise.cnpj).toEqual(body.cnpj)
	})
})

afterAll(async () => {
	await cleanDb()
	await disconnectServer()
})
