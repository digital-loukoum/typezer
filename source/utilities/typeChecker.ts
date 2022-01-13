import type ts from "typescript"

let typeChecker!: ts.TypeChecker

export function getTypeChecker() {
	if (!typeChecker) throw "Type checker is not defined"
	return typeChecker
}

export function setTypeChecker(value: ts.TypeChecker) {
	typeChecker = value
}
