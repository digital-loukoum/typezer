import { Type } from "../types/Type/Type"

export function resolveTypeOfValue(value: unknown): Type | undefined {
	const type = _resolveTypeOfValue(value)
	if (type) {
		return {
			typeName: "Union",
			items: [{ typeName: "Null" }, { typeName: "Undefined" }, type],
		}
	}
}

function _resolveTypeOfValue(value: unknown): Type | undefined {
	switch (typeof value) {
		case "string":
			return { typeName: "String" }
		case "number":
			return { typeName: "Number" }
		case "bigint":
			return { typeName: "BigInteger" }
		case "boolean":
			return { typeName: "Boolean" }
		case "function":
			return {
				typeName: "Function",
				signatures: [
					{ minimumParameters: 0, parameters: [], returnType: { typeName: "Any" } },
				],
			}
		case "symbol":
			return { typeName: "Symbol" }
		case "undefined":
			return
		case "object":
			if (!value) return
			if (value instanceof Array) return { typeName: "Array", items: { typeName: "Any" } }
			if (value instanceof RegExp) return { typeName: "RegularExpression" }
			if (value instanceof Date) return { typeName: "Date" }
			if (value instanceof ArrayBuffer) return { typeName: "ArrayBuffer" }
			if (value instanceof Map)
				return { typeName: "Map", keys: { typeName: "Any" }, items: { typeName: "Any" } }
			if (value instanceof Set) return { typeName: "Set", items: { typeName: "Any" } }
			return { typeName: "Object", properties: {} }
	}
}
