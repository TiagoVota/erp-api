import { permissionRepository, userRepository } from '../repositories/index.js'

import { getCpfNumbers, isValidCpf } from '../utils/cpfCnpjValidations.js'
import { encryptValue, isValidEncrypt } from '../utils/encryptor.js'
import { generateToken } from '../utils/authorizations.js'
import { formatUserData, formatUsersData } from './helpers/formatUserHelper.js'
import { makeAdminPermissions } from './helpers/adminHelper.js'

import {
	ExistentAdminError,
	ExistentUserCpfError,
	ExistentUserEmailError,
	ForbiddenAdminDeleteError,
	ForbiddenAdminError,
	ForbiddenUserAction,
	InvalidPasswordError,
	NoUserByIdError,
	NoUserError,
	UnprocessableCpfError,
} from '../errors/index.js'


const createAdmin = async (createAdminBody) => {
	const formattedBody = formatUserBodyOrFail(createAdminBody)

	await validateExistentAdminOrFail()
	await validateExistentUserOrFail(formattedBody.email, formattedBody.cpf)

	const hashPassword = encryptValue(formattedBody.password)

	const adminInfo = await insertUser(
		{
			...formattedBody,
			password: hashPassword,
			isAdmin: true,
		},
		makeAdminPermissions()
	)
	
	return adminInfo
}


const createUser = async (createAdminBody) => {
	const formattedBody = formatUserBodyOrFail(createAdminBody)

	await validateExistentUserOrFail(formattedBody.email, formattedBody.cpf)

	const hashPassword = encryptValue(formattedBody.password)

	const userInfo = await insertUser({
		...formattedBody,
		password: hashPassword,
	})

	return userInfo
}


const authorizeUser = async (loginData) => {
	const user = await validateUserEmailOrFail(loginData.email)
	validatePasswordOrFail(loginData.password, user.password)

	const token = generateToken(formatUserData(user))

	return { token }
}


const findUsersAndPermissions = async (query) => {
	const DEFAULT_LIMIT = 20
	const DEFAULT_OFFSET = 0
	
	const limit = Number(query?.limit) || DEFAULT_LIMIT
	const offset = Number(query?.offset) || DEFAULT_OFFSET

	const usersInfo = await userRepository.findWithPermissions({
		take: limit,
		skip: offset * limit,
	})

	return formatUsersData(usersInfo)
}


const findUser = async ({ userId, user }) => {
	const permissions = await permissionRepository.findByUserId(user.id)
	const isSameUser = Boolean(userId === user.id)

	const haveToIncludePermission = isSameUser || permissions.seeUsers

	const usersInfo = await userRepository.find({
		id: userId,
		haveToIncludePermission,
	})

	return formatUserData(usersInfo)
}


const updateUser = async ({ userId, userData, requestUser }) => {
	const formattedBody = formatUserBodyOrFail(userData)

	const oldUser = await validateUserByIdOrFail(userId)
	await validateUserActionOrFail(requestUser.id, userId)
	const isSameEmail = Boolean(formattedBody.email === oldUser.email)
	if (!isSameEmail) await validateExistentUserEmailOrFail(formattedBody.email)
	
	const hashPassword = encryptValue(formattedBody.password)

	const updatedUser = await userRepository.updateById({
		id: userId,
		data: {
			...formattedBody,
			password: hashPassword,
		},
	})

	return formatUserData(updatedUser)
}


const updateUserByAdmin = async ({ userId, userData, requestUser }) => {
	validateAdminOrFail(requestUser.isAdmin)

	const formattedBody = formatUserBodyOrFail(userData)

	const oldUser = await validateUserByIdOrFail(userId)
	const isSameEmail = Boolean(formattedBody.email === oldUser.email)
	if (!isSameEmail) await validateExistentUserEmailOrFail(formattedBody.email)
	
	const updatedUser = await userRepository.updateById({
		id: userId,
		data: formattedBody,
	})

	return formatUserData(updatedUser)
}


const removeUser = async ({ userId }) => {
	const user = await validateUserByIdOrFail(userId)
	validateAdminDeleteOrFail(user.isAdmin, userId)

	const deletedUser = await userRepository.deleteById(userId)

	return formatUserData(deletedUser)
}


const formatUserBodyOrFail = (createUserBody) => {
	const { cpf, email } = createUserBody
	const formattedBody = {
		...createUserBody,
		email: email.trim().toLowerCase(),
	}

	if (cpf) {
		validadeValidCpfOrFail(cpf)
		formattedBody.cpf = getCpfNumbers(cpf)
	}

	return formattedBody
}

const validadeValidCpfOrFail = (cpf) => {
	if (!isValidCpf(cpf)) throw new UnprocessableCpfError(cpf)
}

const validateExistentAdminOrFail = async () => {
	const existentAdmin = await userRepository.findAdmin()
	if (existentAdmin) throw new ExistentAdminError()

	return existentAdmin
}

const validateAdminOrFail = (isAdmin) => {
	if (!isAdmin) throw new ForbiddenAdminError()
}

const validateExistentUserOrFail = async (email, cpf) => {
	await validateExistentUserEmailOrFail(email)
	await validateExistentCpfOrFail(cpf)
}

const validateExistentUserEmailOrFail = async (email) => {
	const existentUserEmail = await userRepository.findByEmail(email)
	if (existentUserEmail) throw new ExistentUserEmailError(email)
}

const validateExistentCpfOrFail = async (cpf) => {
	const existentUserCpf = await userRepository.findByCpf(cpf)
	if (existentUserCpf) throw new ExistentUserCpfError(cpf)
}

const insertUser = async (userData, permissionsOptions={}) => {
	const [ user, permissions ] = await userRepository.insertUser(
		userData,
		permissionsOptions,
	)
	delete user.password

	return { user, permissions }
}

const validateUserEmailOrFail = async (email) => {
	const lowerEmail = email.toLowerCase()
	const user = await userRepository.findByEmail(lowerEmail)

	const haveUser = Boolean(user?.id)
	if (!haveUser) throw new NoUserError(lowerEmail)

	return user
}

const validatePasswordOrFail = (password, hashPassword) => {
	const isValidPassword = isValidEncrypt(password, hashPassword)
	if (!isValidPassword) throw new InvalidPasswordError()
}

const validateUserByIdOrFail = async (userId) => {
	const user = await userRepository.findById(userId)
	if (!user) throw new NoUserByIdError(userId)

	return user
}

const validateAdminDeleteOrFail = (isAdmin, userId) => {
	if (isAdmin) throw new ForbiddenAdminDeleteError(userId)
}

const validateUserActionOrFail = async (requestedUserId, givenUserId) => {
	const isSameUser = Boolean(requestedUserId === givenUserId)
	if (!isSameUser) throw new ForbiddenUserAction(givenUserId)
}


export {
	createAdmin,
	createUser,
	authorizeUser,
	validateUserByIdOrFail,
	validateAdminOrFail,
	findUsersAndPermissions,
	findUser,
	updateUser,
	updateUserByAdmin,
	removeUser,
}
