import ts from "typescript"
import { getTypeId } from "./getTypeId"

export function getTypeNameAndId(tsType: ts.Type): {
	name: string | undefined
	id: number
} {
	const tsName = tsType.aliasSymbol?.escapedName
	const name = tsName && String(tsName)
	const id = getTypeId(tsType)

	return { name, id }
}
