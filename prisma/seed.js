import { Prisma } from '@prisma/client'

import prisma from '../src/database/database.js'


const emptyDatabase = async () => {
	const tables = Prisma.dmmf.datamodel.models.map(model => {
		return model.dbName || model.name
	})

	const deletePromises = tables.map(table => {
		return prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`)
	})

	return Promise.all(deletePromises)
}

const main = async () => {
	// Clear db
	await emptyDatabase()
}


main()
	.catch((error) => {
		console.log(error)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
