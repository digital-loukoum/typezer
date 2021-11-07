import ts from "typescript"

let typeChecker!: ts.TypeChecker

export function getTypeChecker() {
	if (!typeChecker) throw "Type checker is not defined"
	return typeChecker
}

export function setTypeChecker(value: ts.TypeChecker) {
	typeChecker = value
}

export function isArrayType(type: ts.Type): boolean {
	// @ts-ignore
	return getTypeChecker().isArrayType(type)
}

/**
 * @returns the subtype of the array if it is an array, null otherwise
 */
export function getArrayType(type: ts.Type): ts.Type | null {
	if (isArrayType(type)) {
		return getTypeChecker().getTypeArguments(type as ts.TypeReference)[0]
	} else {
		for (const baseType of type.getBaseTypes() ?? []) {
			const arrayType = getArrayType(baseType)
			if (arrayType) return arrayType
		}
	}
	return null
}

export function isTupleType(type: ts.Type): boolean {
	// @ts-ignore
	return getTypeChecker().isTupleType(type)
}

/**
 * Walk recursively though all parents until a condition a trueish value is returned
 * @returns a trueish value from the callback or false if no base type passed the test
 */
export function someBaseType<R>(
	type: ts.Type,
	callback: (type: ts.Type) => R
): R | false {
	const result = callback(type)
	if (result) return result
	else {
		for (const baseType of type.getBaseTypes() ?? []) {
			const result = someBaseType(baseType, callback)
			if (result) return result
		}
	}
	return false
}

export function getPrimitiveType(type: ts.Type): ts.Type | false {
	return someBaseType(type, type => (!(type.flags & ts.TypeFlags.Object) ? type : false))
}
