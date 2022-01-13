import type ts from "typescript"
import { getTypeChecker } from "./typeChecker"
import { isTupleType } from "./isTupleType"

/**
 * @returns the subtype of the array if it is an array, null otherwise
 */
export function getTupleType(type: ts.Type): readonly ts.Type[] | undefined {
	if (isTupleType(type)) {
		return getTypeChecker().getTypeArguments(type as ts.TypeReference)
	}
}
