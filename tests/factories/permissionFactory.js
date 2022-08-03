import prisma from '../../src/database/database'


const findPermissionByUserId = async (userId) => {
	const user = await prisma.permission.findUnique({
		where: {
			userId,
		},
	})

	return user
}


export {
	findPermissionByUserId,
}
