import prisma from '../../src/database/database'


const disconnectServer = async () => {
	await prisma.$disconnect()
}


const truncateHealth = async () => {
	await prisma.$executeRaw`TRUNCATE TABLE health;`
}


const truncateUsers = async () => {
	await prisma.$executeRaw`TRUNCATE TABLE users CASCADE;`
}


const truncateEnterprises = async () => {
	await prisma.$executeRaw`TRUNCATE TABLE enterprises CASCADE;`
}


export {
	disconnectServer,
	truncateHealth,
	truncateUsers,
	truncateEnterprises,
}
