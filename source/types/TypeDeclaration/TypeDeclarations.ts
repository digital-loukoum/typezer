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
		const type = Type.fromNode(node)
		this.aliasOf = type.toProperty()
	}
}

export class EnumerationDeclaration {
	readonly type = "Enumeration"
	public properties: Properties

	constructor(node: ts.EnumDeclaration) {
		throw "TODO: enumerations"
	}
}
