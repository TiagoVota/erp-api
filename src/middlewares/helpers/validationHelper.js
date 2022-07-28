import { stripHtml } from 'string-strip-html'


const sanitizeInput = (obj) => {
	for (const key in obj) {
		if (isSanitizableValue(obj[key])) obj[key] = sanitizeStr(obj[key])
	}

	return obj
}

const sanitizeStr = (str) => stripHtml(str).result.trim()

const isSanitizableValue = (value) => {
	return typeof value !== 'number'
}


export {
	sanitizeInput,
}
