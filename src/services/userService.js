import { userRepository } from '../repositories/index.js'

import { getCpfNumbers, isValidCpf } from '../utils/cpfCnpjValidations.js'
import { encryptValue, isValidEncrypt } from '../utils/encryptor.js'
import { generateToken } from '../utils/authorizations.js'
import { formatTokenData } from './helpers/formatUserHelper.js'
import { makeAdminPermissions } from './helpers/adminHelper.js'

import {
	ExistentAdminError,
	ExistentUserError,
	InvalidPasswordError,
	NoUserByIdError,
	NoUserError,
	UnprocessableCpfError,
} from '../errors/index.js'


const createAdmin = async (createAdminBody) => {
	const formattedBody = await formatCreateBodyOrFail(createAdminBody)

	await validateExistentAdmin()
	await validateExistentUser(formattedBody.email)

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


const createUser = async ({ name, email, password }) => {
	await validateExistentUser(email)

	const hashPassword = encryptValue(password)

	const user = await insertUser({
		name,
		email: email.toLowerCase(),
		password: hashPassword
	})
	
	return user
}


const authorizeUser = async ({ email, password }) => {
	const user = await userRepository.findByEmail(email)

	validateUser(user, email)
	validatePassword(password, user.password)

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

const validateExistentAdmin = async () => {
	const existentAdmin = await userRepository.findAdmin()
	if (existentAdmin) throw new ExistentAdminError()

	return existentAdmin
}

const validateExistentUser = async (email) => {
	const existentUserEmail = await userRepository.findByEmail(email)
	if (existentUserEmail) throw new ExistentUserError(email)
}

const insertUser = async (userData, permissionsOptions={}) => {
	const [ user, permissions ] = await userRepository.insertUser(
		userData,
		permissionsOptions,
	)
	delete user.password

	return { user, permissions }
}

const validateUser = (user, email) => {
	const haveUser = Boolean(user?.id)
	if (!haveUser) throw new NoUserError(email)
}

const validatePassword = (password, hashPassword) => {
	const isValidPassword = isValidEncrypt(password, hashPassword)
	if (!isValidPassword) throw new InvalidPasswordError()
}

const validateUserById = async (userId) => {
	const user = await userRepository.findById(userId)
	if (!user) throw new NoUserByIdError(userId)

	return user
}


export {
	createAdmin,
	createUser,
	authorizeUser,
	validateUserById,
}
