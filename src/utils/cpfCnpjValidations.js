import { cpf, cnpj } from 'cpf-cnpj-validator' 


const isValidCpf = cpfStr => cpf.isValid(cpfStr)
const formatCpf = cpfStr => cpf.format(cpfStr)
const getCpfNumbers = cpfStr => cpf.strip(cpfStr)

const isValidCnpj = cnpjStr => cnpj.isValid(cnpjStr)
const formatCnpj = cnpjStr => cnpj.format(cnpjStr)
const getCnpjNumbers = cnpjStr => cnpj.strip(cnpjStr)


export {
	isValidCpf,
	formatCpf,
	getCpfNumbers,
	isValidCnpj,
	formatCnpj,
	getCnpjNumbers,
}
