import type ts from "typescript"

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
