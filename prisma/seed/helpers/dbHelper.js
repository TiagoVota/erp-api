import { Prisma } from '@prisma/client'

import prisma from '../../../src/database/database.js'


const disconnectDb = async () => {
	await prisma.$disconnect()
}


const truncateDb = async () => {
	const tables = Prisma.dmmf.datamodel.models.map(model => {
		return model.dbName || model.name
	})

	const deletePromises = tables.map(table => {
		return prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`)
	})

	return Promise.all(deletePromises)
}


export {
	disconnectDb,
	truncateDb,
}
