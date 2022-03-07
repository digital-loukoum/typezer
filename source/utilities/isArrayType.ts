import type ts from "typescript"
import { getTypeChecker } from "./typeChecker"

export function isArrayType(type: ts.Type): boolean {
	// @ts-ignore
	return getTypeChecker().isArrayType(type)
}