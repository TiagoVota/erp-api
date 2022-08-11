import dayjs from 'dayjs'


const formatDate = (date) => {
	const formattedDate = dayjs(date).format()

	if (formattedDate === 'Invalid Date') return null
	return formattedDate
}


export {
	formatDate,
}
