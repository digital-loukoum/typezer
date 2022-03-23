import { serializeTemplateLiteral } from "../../utilities/serializeTemplateLiteral"
import { Properties } from "../Properties/Properties"
import { Signature } from "../Signature/Signature"
import { Type } from "./Type"
import { TypeName } from "./TypeName"
import { Types } from "./Types"

export function typeToString(type: Type): string {
	const { typeName } = type
	return stringifiers[typeName]?.(type as any) ?? typeName
}

export function stringifyProperties(properties: Properties): string {
	return `{ ${Object.entries(properties)
		.map(([name, property]) => {
			let result = ""
			if (property.modifiers) result += property.modifiers.join(" ") + " "
			result += name
			result += property.optional ? "?:" : ":"
			result += typeToString(property)
			return result
		})
		.join(", ")} }`
}

export function stringifySignature(signature: Signature): string {
	return `(${signature.parameters.map(typeToString).join(", ")}) => ${typeToString(
		signature.returnType
	)}`
}

export function stringifySignatures(signatures: Signature[]): string {
	return signatures.map(stringifySignature).join(" | ")
}

export const stringifiers: {
	[Key in TypeName]?: (type: Types[Key]) => string
} = {
	StringLiteral: ({ value }) => `"${value}"`,
	TemplateLiteral: ({ texts, types }) => serializeTemplateLiteral(texts, types),
	NumberLiteral: ({ value }) => String(value),
	BigIntegerLiteral: ({ value }) => String(value),
	BooleanLiteral: ({ value }) => String(value),

	Object: ({ properties }) => stringifyProperties(properties),
	Namespace: ({ properties }) => `namespace ${stringifyProperties(properties)}`,
	Class: ({ properties }) => `class ${stringifyProperties(properties)}`,

	Record: ({ keys, items }) => `Record<${typeToString(keys)}, ${typeToString(items)}>`,
	Promise: ({ item }) => `Promise<${typeToString(item)}>`,

	Map: ({ keys, items }) => `Map<${typeToString(keys)}, ${typeToString(items)}>`,

	Array: ({ items }) => `Array<${typeToString(items)}>`,
	Set: ({ items }) => `Set<${typeToString(items)}>`,
	Tuple: ({ items }) => `[${items.map(typeToString).join(", ")}]`,
	Union: ({ items }) => items.map(typeToString).join(" | "),

	Enumeration: ({ items }) =>
		`Enum<${Object.values(items).map(typeToString).join(" | ")}>`,

	Function: ({ signatures }) => stringifySignatures(signatures),
}
