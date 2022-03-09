import ts from "typescript"
import { getReturnTypeOfMethod } from "./getReturnTypeOfMethod"

export function methodReturnTypeMatchesFlags(
	type: ts.Type,
	node: ts.Node,
	methodName: string,
	flags: ts.TypeFlags
): boolean {
	const returnType = getReturnTypeOfMethod(type, node, methodName)
	return !!(returnType && returnType.flags & flags)
}
