import type ts from "typescript"
import { getTypeChecker, isArrayType } from "../typeChecker"

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
