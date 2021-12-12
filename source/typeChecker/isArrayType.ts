import type ts from "typescript"

export function isArrayType(type: ts.Type): boolean {
	// @ts-ignore
	return getTypeChecker().isArrayType(type)
}
