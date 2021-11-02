import type ts from "typescript"

let typeChecker!: ts.TypeChecker

export const getTypeChecker = () => {
	if (!typeChecker) throw "Type checker is not defined"
	return typeChecker
}

export const setTypeChecker = (value: ts.TypeChecker) => {
	typeChecker = value
}

export const isArrayType = (type: ts.Type): boolean => {
	// @ts-ignore
	return getTypeChecker().isArrayType(type)
}

export const isTupleType = (type: ts.Type): boolean => {
	// @ts-ignore
	return getTypeChecker().isTupleType(type)
}
