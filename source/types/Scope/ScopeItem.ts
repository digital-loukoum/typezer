import ts from "typescript"

export type ScopeItem = {
	rawType: ts.Type
	rawGenerics: Record<string, ts.Type>
}
