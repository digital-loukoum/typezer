import ts from "typescript"

export function getTypeId(type: ts.Type): number {
	return (type as any).id
}
