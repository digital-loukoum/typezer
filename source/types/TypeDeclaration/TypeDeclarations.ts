import ts from "typescript"
import { getTypeChecker } from "../../utilities/typeChecker"
import { nodeToProperties } from "../../utilities/nodeToProperties"
import { Properties } from "../Properties/Properties"
import { createType } from "../Type/createType"
import { Type } from "../Type/Type"

export class ClassDeclaration {
	readonly type = "Class"
	public properties: Properties
	public extends = []

	constructor(tsNode: ts.ClassDeclaration) {
		this.properties = nodeToProperties(tsNode)
	}
}

export class PrimitiveClassDeclaration {
	readonly type = "PrimitiveClass"
	public properties: Properties
	public extends = []

	constructor(tsNode: ts.ClassDeclaration) {
		this.properties = nodeToProperties(tsNode)
	}
}

export class InterfaceDeclaration {
	readonly type = "Interface"
	public properties: Properties = {}
	public extends = []

	constructor(tsNode: ts.InterfaceDeclaration) {
		this.properties = nodeToProperties(tsNode)
	}
}

export class TypeAliasDeclaration {
	readonly type = "TypeAlias"
	public aliasOf: Type

	constructor(tsNode: ts.TypeAliasDeclaration) {
		const tsType = getTypeChecker().getTypeAtLocation(tsNode)
		this.aliasOf = createType(tsType, tsNode)
	}
}

export class EnumerationDeclaration {
	readonly type = "Enumeration"
	public properties: Properties

	constructor(node: ts.EnumDeclaration) {
		throw "TODO: enumerations"
	}
}
