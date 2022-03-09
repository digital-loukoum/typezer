import ts from "typescript"
import { getTypeOfSymbol } from "./getTypeOfSymbol"

/**
 * Check if the given type object has a "valueOf" function that returns a the given type.
 * This function is used to detect some types (Boolean, BigInt) with a great accuracy.
 */
export function getReturnTypeOfMethod(
	type: ts.Type,
	node: ts.Node,
	methodName: string
): ts.Type | undefined {
	const properties = type.getProperties()
	const method = properties.find(({ escapedName }) => escapedName == methodName)
	if (!method) return
	const methodType = getTypeOfSymbol(method, node)
	const [signature] = methodType.getCallSignatures()
	if (!signature) return
	return signature.getReturnType()
}
