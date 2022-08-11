import { stripHtml } from 'string-strip-html'


const sanitizeInput = (obj) => {
	for (const key in obj) {
		if (isSanitizableValue(obj[key])) obj[key] = sanitizeStr(obj[key])
	}

	return obj
}

const sanitizeStr = (str) => stripHtml(str).result.trim()

const isSanitizableValue = (value) => {
	const invalidTypes = ['number', 'boolean']
	const valueType = typeof(value)

	return !invalidTypes.includes(valueType)
}


export {
	sanitizeInput,
}
