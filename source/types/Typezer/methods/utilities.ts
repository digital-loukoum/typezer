import ts from "typescript"
import { Typezer } from "../Typezer"

export function utilities(this: Typezer) {
	return {
		isArrayType: (rawType: ts.Type): boolean => {
			// @ts-ignore
			return this.checker.isArrayType(rawType)
		},

		getArrayType: (rawType: ts.Type): ts.Type | undefined => {
			if (this.utilities.isArrayType(rawType)) {
				return this.checker.getTypeArguments(rawType as ts.TypeReference)[0]
			}
		},

		isTupleType: (type: ts.Type): boolean => {
			// @ts-ignore
			return this.checker.isTupleType(type)
		},

		getTupleType: (type: ts.Type): readonly ts.Type[] | undefined => {
			if (this.utilities.isTupleType(type)) {
				return this.checker.getTypeArguments(type as ts.TypeReference)
			}
		},

		getReturnTypeOfMethod: (
			type: ts.Type,
			node: ts.Node,
			methodName: string
		): ts.Type | undefined => {
			const properties = type.getProperties()
			const method = properties.find(({ escapedName }) => escapedName == methodName)
			if (!method) return
			const methodType = this.checker.getTypeOfSymbolAtLocation(method, node)
			const [signature] = methodType.getCallSignatures()
			if (!signature) return
			return signature.getReturnType()
		},

		methodReturnTypeMatchesFlags: (
			type: ts.Type,
			node: ts.Node,
			methodName: string,
			flags: ts.TypeFlags
		): boolean => {
			const returnType = this.utilities.getReturnTypeOfMethod(type, node, methodName)
			return !!(returnType && returnType.flags & flags)
		},
	}
}
