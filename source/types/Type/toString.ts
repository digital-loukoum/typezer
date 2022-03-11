import { serializeTemplateLiteral } from "../../utilities/serializeTemplateLiteral"
import { Typezer } from "../Typezer/Typezer"
import { TypeName, Types } from "./Type"

export function toString(this: Typezer): {
	[Key in TypeName]?: (type: Types[Key]) => string
} {
	return {
		StringLiteral: ({ value }) => `"${value}"`,
		TemplateLiteral: ({ texts, types }) => serializeTemplateLiteral(texts, types),
		NumberLiteral: ({ value }) => String(value),
		BigIntegerLiteral: ({ value }) => String(value),
		BooleanLiteral: ({ value }) => String(value),

		Object: ({ properties }) =>
			`{ ${Object.entries(properties)
				.map(([name, property]) => {
					let result = ""
					if (property.modifiers) result += property.modifiers.join(" ") + " "
					result += name
					result += property.optional ? "?:" : ":"
					result += this.typeToString(property)
					return result
				})
				.join(", ")} }`,

		Record: ({ keys, items }) =>
			`Record<${this.typeToString(keys)}, ${this.typeToString(items)}>`,

		Map: ({ keys, items }) =>
			`Map<${this.typeToString(keys)}, ${this.typeToString(items)}>`,

		Array: ({ items }) => `Array<${this.typeToString(items)}>`,
		Set: ({ items }) => `Set<${this.typeToString(items)}>`,
		Tuple: ({ items }) => `[${items.map(this.typeToString)}]`,
		Union: ({ items }) => items.map(this.typeToString).join(" | "),

		Enumeration: ({ items }) =>
			`Enum<${Object.values(items).map(this.typeToString).join(" | ")}>`,
	}
}
