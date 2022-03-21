const floatingNumber = (digit: string) => `-?(${digit}+(\\.${digit}*)?|\\.${digit}+)`

const baseNumberExpression = (digit: string) =>
	`${floatingNumber(digit)}(e${floatingNumber(digit)})?`

const base10numberExpression = baseNumberExpression("\\d")
const base2numberExpression = `0b` + baseNumberExpression("[01]")
const base8numberExpression = `0o` + baseNumberExpression("[0-8]")
const base16numberExpression = `0x` + baseNumberExpression("[0-9a-fA-F]")

const numberExpression = [
	base2numberExpression,
	base8numberExpression,
	base16numberExpression,
	base10numberExpression,
]
	.map(expression => `(${expression})`)
	.join("|")

export const templateExpressions = {
	string: "(.*)",
	bigint: "(\\d+)",
	number: `(${numberExpression})`,
}
