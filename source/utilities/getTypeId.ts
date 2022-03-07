import ts from "typescript"

export function getTypeId(tsType: ts.Type): number {
	return <number>(tsType as any).id
}
