import ts from "typescript"
import { getTypeChecker } from "./typeChecker"

export function isTypeNode(node: ts.Node): boolean {
	return [
		ts.SyntaxKind.TypeAliasDeclaration,
		ts.SyntaxKind.ClassDeclaration,
		ts.SyntaxKind.InterfaceDeclaration,
		ts.SyntaxKind.EnumDeclaration,
	].includes(node.kind)
}

export function getExportedTypeNodeName(node: ts.Node): string | false {
	if (!isTypeNode) return false
	let isExported = false
	let name = ""
	node.forEachChild(child => {
		if (child.kind == ts.SyntaxKind.ExportKeyword) isExported = true
		else if (child.kind == ts.SyntaxKind.Identifier) name = child.getText()
	})
	return isExported && name
}

export function getPropertyName(node: ts.Node): string {
	let name = ""
	node.forEachChild(child => {
		if (child.kind == ts.SyntaxKind.Identifier) name = child.getText()
	})
	return name
}

export enum PrimitiveTypes {
	any = 1,

	unknown = 7,
	undefined = 8,
	null = 10,
	string = 11,
	number,

	boolean = 18,
	void = 20,
	never,

	String = 63,
	Number,
	Boolean,

	Array = 77,
}
export const primitiveTypeIds = [
	1, // Any
	11, // string
	12, // number
	63, // String
	64, // Number
]
