import { faker } from '@faker-js/faker'


const generateId = (defaultId) => {
	const id = Boolean(defaultId) ? defaultId : faker.datatype.number()

	return id
}


export {
	generateId,
}
