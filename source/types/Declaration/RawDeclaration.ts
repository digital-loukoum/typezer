import ts from "typescript"
import { Type } from "../Type/Type"

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
	rawType: ts.Type
	type?: Type // undefined when not cmputed yet
}