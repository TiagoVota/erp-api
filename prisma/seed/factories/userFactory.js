
import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import { cpf } from 'cpf-cnpj-validator'

import prisma from '../../../src/database/database.js'

import { createPermission, makePermissionOptions } from './permissionFactory.js'


const makeUserInfo = ({ isAdmin=false, email }) => {
	const password = Boolean(isAdmin) ? 'admin' : '12345'
	const hashPassword = bcrypt.hashSync(password, 12)

	return {
		cpf: cpf.generate(),
		name: faker.name.findName(),
		email,
		password: hashPassword,
		isAdmin,
	}
}


const createAdmin = async () => {
	const email = 'admin@admin.com'
	const adminData = makeUserInfo({ isAdmin: true, email })

	const admin = await prisma.user.create({
		data: adminData,
	})

	const permissionOptions = makePermissionOptions(true)

	const adminPermissions = await createPermission(admin.id, permissionOptions)

	return { admin, adminPermissions }
}


const createUsers = async (quantity=5) => {
	const createUsersPromises = []
	for (let i = 0; i < quantity; i++) {
		const email = `test${i+1}@test.com`
		const userData = makeUserInfo({ email })
		
		const userPromise = prisma.user.create({
			data: userData,
		})

		createUsersPromises.push(userPromise)
	}

	const users = await Promise.all(createUsersPromises)

	const createPermissionsPromises = []
	for (let i = 0; i < quantity; i++) {
		const haveAdminPermission = !Boolean(i)
		const permissionOptions = makePermissionOptions(haveAdminPermission)
		
		const permissionsPromise = createPermission(users[i].id, permissionOptions)

		createPermissionsPromises.push(permissionsPromise)
	}

	const permissions = await Promise.all(createPermissionsPromises)

	return { users, permissions }
}


export {
	createAdmin,
	createUsers,
}
