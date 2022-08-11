import dayjs from 'dayjs'


const makeValidDate = (date) => {
	return Boolean(date) ? dayjs(date).format() : dayjs().format()
}


export {
	makeValidDate,
}
