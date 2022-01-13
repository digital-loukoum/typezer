import ts from "typescript"
import {
	EnumerationDeclaration,
	InterfaceDeclaration,
	TypeAliasDeclaration,
} from "../../TypeDeclaration"
import { TypeDeclaration } from "./TypeDeclaration"
import { ClassDeclaration } from "./TypeDeclarations"

export function createTypeDeclaration(node: ts.Node): TypeDeclaration {
	if (ts.isClassDeclaration(node)) {
		return new ClassDeclaration(node)
	} else if (ts.isTypeAliasDeclaration(node)) {
		return new TypeAliasDeclaration(node)
	} else if (ts.isEnumDeclaration(node)) {
		return new EnumerationDeclaration(node)
	} else if (ts.isInterfaceDeclaration(node)) {
		return new InterfaceDeclaration(node)
	}
	throw `The given node is not a type: ${ts.SyntaxKind[node.kind]}`
}
