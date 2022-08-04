import { userRepository } from '../repositories/index.js'

import { getCpfNumbers, isValidCpf } from '../utils/cpfCnpjValidations.js'
import { encryptValue, isValidEncrypt } from '../utils/encryptor.js'
import { generateToken } from '../utils/authorizations.js'
import { formatTokenData } from './helpers/formatUserHelper.js'
import { makeAdminPermissions } from './helpers/adminHelper.js'

import {
	ExistentAdminError,
	ExistentUserCpfError,
	ExistentUserEmailError,
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
		isAdmin: true,
	})

	return userInfo
}


const authorizeUser = async (loginData) => {
	const user = await validateUserEmailOrFail(loginData.email)
	validatePasswordOrFail(loginData.password, user.password)

	const token = generateToken(formatTokenData(user))

	return { token }
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
}
