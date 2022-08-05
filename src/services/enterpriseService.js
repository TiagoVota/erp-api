import { enterpriseRepository } from '../repositories/index.js'

import { NoEnterpriseError } from '../errors/index.js'


const findEnterprise = async () => {
	const enterprise = await findEnterpriseOrFail()

	return enterprise
}


const findEnterpriseOrFail = async () => {
	const enterprise = await enterpriseRepository.findOne()
	if (!enterprise) throw new NoEnterpriseError()

	return enterprise
}


export {
	findEnterprise,
}
