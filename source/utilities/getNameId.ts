import ts from "typescript"

export function getTypeNameAndId(tsType: ts.Type): {
	name: string | undefined
	id: number
} {
	const tsName = tsType.aliasSymbol?.escapedName
	const name = tsName && String(tsName)
	const id = <number>(tsType as any).id

	return { name, id }
}
