import type ts from "typescript"
import { isArrayType } from "./isArrayType"
import { getTypeChecker } from "./typeChecker"

/**
 * @returns the subtype of the array if it is an array, null otherwise
 */
export function getArrayType(type: ts.Type): ts.Type | undefined {
	if (isArrayType(type)) {
		return getTypeChecker().getTypeArguments(type as ts.TypeReference)[0]
	}
}
