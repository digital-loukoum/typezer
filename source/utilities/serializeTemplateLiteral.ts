/**
 * Stringify a template literal into a readable string
 * A template literal is made of a sequence of raw texts and types
 */
export function serializeTemplateLiteral(
	texts: Array<string>,
	types: Array<"string" | "number" | "bigint">
): string {
	let result = texts[0]
	for (let i = 0; i < types.length; i++) {
		result += "${" + types[i] + "}" + texts[i + 1]
	}
	return "`" + result + "`"
}
