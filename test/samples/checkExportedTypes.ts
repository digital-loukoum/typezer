// atoms
// export const number = 12
// export const bigInteger = 12n
// export const string = "12"
// export const boolean = false

type XY<T> = {
	x: T
	y: T
}
// type XY<X, Y> = {
// 	x: X
// 	y: Y
// }
// type Z<O> = XY<O, O>

// molecules
// export const object = {
// 	number: 12,
// 	string: "12",
// 	arrayOfNumbers: [12, 12],
// 	innerObject: {
// 		number: 12,
// 		string: "12",
// 	},
// }
// export const arrayOfNumbers = [12, 12]
// export const arrayOfString = ["12", "12"]
// export const arrayOfStringOrNumber = ["12", 12]
// export const tupleOfTwoNumbers: [number, string] = [12, "12"]
// export const setOfNumbers = new Set<number>([12, 13, 14])
// export const mapOfNumbers = new Map<string, number>([["12", 12]])
// export const recordOfNumbers: Record<string, number> = {
// 	number1: 12,
// 	number2: 12,
// }
// export const recordOfStrings: Record<string, string> = {
// 	number1: "12",
// 	number2: "12",
// }
// export const objectOfNumbers: { [key: string]: string } = {
// 	number1: "12",
// 	number2: "12",
// }
// export const simpleObjectOfNumbers = {
// 	number1: "12",
// 	number2: "12",
// }
// export let zabu: Record<string, string> = { x: "351321" }
export const objectXY: XY<string> = {
	x: "12",
	y: "12",
}
// export const objectXY: XY<string, number> = {
// 	x: "12",
// 	y: "12,
// }
// export const objectZ: Z<string> = {
// 	x: "12",
// 	y: "12",
// }

// functions
// export function createNumber() {
// 	return 12
// }
// export const createNumberAlias = createNumber
// export const createdNumber = createNumber()
// export function createString() {
// 	return "12"
// }
// export const createdString = createString()
// export function createObject() {
// 	return { number: 12, string: "12" }
// }
// export const createdObject = createObject()

// classes & instances
// export class ClassConstructor {
// 	number = 12
// 	string = "12"
// }
// export const ClassConstructorAlias = ClassConstructor
// export const classInstance = new ClassConstructor()
// export const classAliasInstance = new ClassConstructorAlias()
