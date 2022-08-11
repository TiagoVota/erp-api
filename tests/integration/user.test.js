import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'

import app from '../../src/app.js'

import { disconnectServer, cleanDb } from '../factories/dbFactory.js'
import { generateValidToken } from '../factories/tokenFactory.js'
import {
	createUserPermissions,
	findPermissionByUserId,
	makePermissionsOptions,
} from '../factories/permissionFactory.js'
import {
	createUser,
	findUserById,
	makeUpdateUserBody,
} from '../factories/userFactory.js'
import { generateId } from '../factories/idFactory.js'


describe('GET /users', () => {
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

	it('should return UNPROCESSABLE ENTITY for invalid query params', async () => {
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

describe('DELETE /users/:userId', () => {
	beforeEach(cleanDb)

	it('should return UNAUTHORIZED when no token is given', async () => {
		const userId = generateId()

		const response = await supertest(app)
			.delete(`/users/${userId}`)
			.set('Authorization', `Bearer ${undefined}`)

		expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
	})

	it('should return FORBIDDEN when not allowed user make the request given', async () => {
		const userId = generateId()
		const notAllowedUser = await createUser()
		await createUserPermissions(notAllowedUser.id)

		const token = await generateValidToken({ defaultUser: notAllowedUser })

		const response = await supertest(app)
			.delete(`/users/${userId}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.FORBIDDEN)
	})

	it('should return UNPROCESSABLE ENTITY for invalid params', async () => {
		const allowedUser = await createUser()
		await createUserPermissions(allowedUser.id, 'deleteUsers')
		const invalidUserId = 'invalid userId'

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.delete(`/users/${invalidUserId}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return OK when delete user', async () => {
		const createUserPromise = [createUser(), createUser()]
		const [ allowedUser, userToDelete ] = await Promise.all(createUserPromise)
		await createUserPermissions(allowedUser.id, 'deleteUsers')

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.delete(`/users/${userToDelete.id}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.OK)
	})

	it('should delete user and permissions from database', async () => {
		const createUserPromise = [createUser(), createUser()]
		const [ allowedUser, userToDelete ] = await Promise.all(createUserPromise)
		const createPermissionPromise = [
			createUserPermissions(allowedUser.id, 'deleteUsers'),
			createUser(userToDelete.id),
		]
		await Promise.all(createPermissionPromise)

		const token = await generateValidToken({ defaultUser: allowedUser })

		await supertest(app)
			.delete(`/users/${userToDelete.id}`)
			.set('Authorization', `Bearer ${token}`)

		const checkDeletePromises = [
			findUserById(userToDelete.id),
			findPermissionByUserId(userToDelete.id),
		]
		const [
			deletedUser,
			deletedPermission,
		] = await Promise.all(checkDeletePromises)

		expect(deletedUser).toBeNull()
		expect(deletedPermission).toBeNull()
	})
})

describe('PUT /users/:userId', () => {
	beforeEach(cleanDb)

	it('should return UNAUTHORIZED when no token is given', async () => {
		const userId = generateId()

		const response = await supertest(app)
			.put(`/users/${userId}`)
			.set('Authorization', `Bearer ${undefined}`)

		expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
	})

	it('should return UNPROCESSABLE ENTITY for invalid params', async () => {
		const user = await createUser()
		const invalidUserId = 'invalid userId'

		const token = await generateValidToken({ defaultUser: user })

		const response = await supertest(app)
			.put(`/users/${invalidUserId}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return UNPROCESSABLE ENTITY for invalid body', async () => {
		const user = await createUser()
		const invalidBody = makeUpdateUserBody()
		delete invalidBody.email

		const token = await generateValidToken({ defaultUser: user })

		const response = await supertest(app)
			.put(`/users/${user.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(invalidBody)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return OK when update user', async () => {
		const user = await createUser()
		const body = makeUpdateUserBody()

		const token = await generateValidToken({ defaultUser: user })

		const response = await supertest(app)
			.put(`/users/${user.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body)

		expect(response.status).toEqual(StatusCodes.OK)
	})

	it('should update user in database', async () => {
		const user = await createUser()
		const body = makeUpdateUserBody()
		const toInsertEmail = body.email.trim().toLowerCase()

		const token = await generateValidToken({ defaultUser: user })

		await supertest(app)
			.put(`/users/${user.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body)
		const updatedUser = await findUserById(user.id)

		expect(updatedUser.email).toEqual(toInsertEmail)
	})
})

describe('PUT /users/permissions/:userId', () => {
	beforeEach(cleanDb)

	it('should return UNAUTHORIZED when no token is given', async () => {
		const userId = generateId()

		const response = await supertest(app)
			.put(`/users/permissions/${userId}`)
			.set('Authorization', `Bearer ${undefined}`)

		expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
	})

	it('should return FORBIDDEN when not allowed user make the request given', async () => {
		const userId = generateId()
		const notAllowedUser = await createUser()
		await createUserPermissions(notAllowedUser.id)

		const token = await generateValidToken({ defaultUser: notAllowedUser })

		const response = await supertest(app)
			.put(`/users/permissions/${userId}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.FORBIDDEN)
	})

	it('should return UNPROCESSABLE ENTITY for invalid params', async () => {
		const allowedUser = await createUser()
		await createUserPermissions(allowedUser.id, 'editPermissions')
		const invalidUserId = 'invalid userId'

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.put(`/users/permissions/${invalidUserId}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return UNPROCESSABLE ENTITY for invalid body', async () => {
		const createUserPromises = [ createUser(), createUser() ]
		const [ toUpdateUser, allowedUser ] = await Promise.all(createUserPromises)
		await createUserPermissions(allowedUser.id, 'editPermissions')
		const invalidBody = makePermissionsOptions()
		delete invalidBody.addUsers

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.put(`/users/permissions/${toUpdateUser.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(invalidBody)

		expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY)
	})

	it('should return OK when update user permissions', async () => {
		const createUserPromises = [ createUser(), createUser() ]
		const [ toUpdateUser, allowedUser ] = await Promise.all(createUserPromises)
		const createPermissionsPromises = [
			createUserPermissions(toUpdateUser.id),
			createUserPermissions(allowedUser.id, 'editPermissions'),
		]
		await Promise.all(createPermissionsPromises)
		const body = makePermissionsOptions()

		const token = await generateValidToken({ defaultUser: allowedUser })

		const response = await supertest(app)
			.put(`/users/permissions/${toUpdateUser.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body)

		expect(response.status).toEqual(StatusCodes.OK)
	})

	it('should update user permissions in database', async () => {
		const createUserPromises = [ createUser(), createUser() ]
		const [ toUpdateUser, allowedUser ] = await Promise.all(createUserPromises)
		const createPermissionsPromises = [
			createUserPermissions(toUpdateUser.id),
			createUserPermissions(allowedUser.id, 'editPermissions'),
		]
		await Promise.all(createPermissionsPromises)
		const body = makePermissionsOptions()

		const token = await generateValidToken({ defaultUser: allowedUser })

		await supertest(app)
			.put(`/users/permissions/${toUpdateUser.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body)

		const updatedPermissions = await findPermissionByUserId(toUpdateUser.id)

		expect(updatedPermissions).not.toBeNull()
		expect(updatedPermissions['addUsers']).toEqual(body['addUsers'])
	})
})


afterAll(async () => {
	await cleanDb()
	await disconnectServer()
})
