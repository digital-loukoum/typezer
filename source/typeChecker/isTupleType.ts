import type ts from "typescript"

export function isTupleType(type: ts.Type): boolean {
	// @ts-ignore
	return getTypeChecker().isTupleType(type)
}
