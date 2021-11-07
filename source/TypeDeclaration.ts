import ts from "typescript"
import { Properties, Property } from "./Property"
import { Type } from "./Type"

export type TypeDeclaration =
	| ClassDeclaration
	| InterfaceDeclaration
	| EnumerationDeclaration
	| TypeAliasDeclaration

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

export class ClassDeclaration {
	readonly type = "Class"
	public properties: Properties
	public extends = []

	constructor(node: ts.ClassDeclaration) {
		this.properties = Type.fromNode(node).getProperties()
	}
}

export class PrimitiveClassDeclaration {
	readonly type = "PrimitiveClass"
	public properties: Properties
	public extends = []

	constructor(node: ts.ClassDeclaration) {
		this.properties = Type.fromNode(node).getProperties()
	}
}

export class InterfaceDeclaration {
	readonly type = "Interface"
	public properties: Properties = {}
	public extends = []

	constructor(node: ts.InterfaceDeclaration) {
		this.properties = Type.fromNode(node).getProperties()
	}
}

export class TypeAliasDeclaration {
	readonly type = "TypeAlias"
	public aliasOf: Property

	constructor(node: ts.TypeAliasDeclaration) {
		this.aliasOf = Type.fromNode(node).toProperty()
	}
}

export class EnumerationDeclaration {
	readonly type = "Enumeration"
	public properties: Properties

	constructor(node: ts.EnumDeclaration) {
		throw "TODO: enumerations"
	}
}
