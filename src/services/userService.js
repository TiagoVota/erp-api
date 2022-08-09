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
	ForbiddenAdminError,
	InvalidPasswordError,
	NoUserByIdError,
	NoUserError,
	UnprocessableCpfError,
} from '../errors/index.js'


const createAdmin = async (createAdminBody) => {
	const formattedBody = await formatCreateBodyOrFail(createAdminBody)

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
	const formattedBody = await formatCreateBodyOrFail(createAdminBody)

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


const formatCreateBodyOrFail = async (createUserBody) => {
	const { cpf, email } = createUserBody
	if (!isValidCpf(cpf)) throw new UnprocessableCpfError(cpf)

	return {
		...createUserBody,
		cpf: getCpfNumbers(cpf),
		email: email.trim().toLowerCase(),
	}
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


export {
	createAdmin,
	createUser,
	authorizeUser,
	validateUserByIdOrFail,
	validateAdminOrFail,
	findUsersAndPermissions,
	findUser,
}
