import bcrypt from 'bcrypt'


const encryptValue = (value) => {
	const SALT = 12
	return bcrypt.hashSync(value, SALT)
}


const isValidEncrypt = (value, hashValue) => {
	return bcrypt.compareSync(value, hashValue)
}


export {
	encryptValue,
	isValidEncrypt,
}
