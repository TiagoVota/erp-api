import { formatUserData } from './formatUserHelper.js'


const formatTransactionData = (transaction) => {
	const { payer, payee } = transaction
	const formattedTransactionData = { ...transaction }

	formattedTransactionData.payer = formatUserData(payer)
	formattedTransactionData.payee = formatUserData(payee)

	return formattedTransactionData
}

const formatTransactionsData = (transactionList) => {
	const formattedTransactionList = transactionList.map(formatTransactionData)

	return formattedTransactionList
}


export {
	formatTransactionData,
	formatTransactionsData,
}
