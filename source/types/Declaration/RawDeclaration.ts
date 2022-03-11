import ts from "typescript"

export type RawDeclaration = {
	id: string
	declare:
		| "enumeration"
		| "class"
		| "interface"
		| "type"
		| "variable"
		| "function"
		| "default"
	fileName: string
	name: string
	exportedAs: string[]
	node: ts.Node
	type: ts.Type
}
