import type ts from "typescript"

let typeChecker!: ts.TypeChecker

export const getTypeChecker = () => {
	if (!typeChecker) throw "Type checker is not defined"
	return typeChecker
}

export const setTypeChecker = (value: ts.TypeChecker) => {
	typeChecker = value
}
