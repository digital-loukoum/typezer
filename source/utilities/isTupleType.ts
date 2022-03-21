import type ts from "typescript"
import { getTypeChecker } from "./typeChecker"

export function isTupleType(type: ts.Type): boolean {
	// @ts-ignore
	return getTypeChecker().isTupleType(type)
}
