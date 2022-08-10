import { disconnectDb, truncateDb } from './helpers/dbHelper.js'
import { createEnterprise } from './factories/enterpriseFactory.js'
import { createAdmin, createUsers } from './factories/userFactory.js'


const main = async () => {
	await truncateDb()
	const { admin, adminPermissions } = await createAdmin()
	const { users, permissions } = await createUsers()
	const enterprise = await createEnterprise(admin.id)

	console.log('\nAdmin Info:')
	console.log({
		admin,
		adminPermissions,
	})
	console.log('\nEnterprise Info:')
	console.log({
		enterprise,
	})
	console.log('\nUsers Info:')
	console.log({
		users,
		permissions,
		enterprise,
	})
}


main()
	.catch((error) => {
		console.log(error)
		process.exit(1)
	})
	.finally(disconnectDb)
