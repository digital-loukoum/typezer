import ts from "typescript"

export type Property =
	| UnknownProperty
	| UnknownProperty
	| VoidProperty
	| BooleanProperty
	| NumberProperty
	| StringProperty
	| DateProperty
	| BigIntegerProperty
	| BlobProperty
	| AnyProperty
	| RecordProperty
	| ArrayProperty
	| TupleProperty
	| ObjectProperty
	| MapProperty
	| SetProperty
	| UnionProperty
	| FunctionProperty

export type Properties = Record<string, Property>

export type Modifier = keyof typeof ts.ModifierFlags

export type FunctionPropertySignature = {
	parameters: Property[]
	returnType: Property
}

export abstract class AbstractProperty {
	public optional?: boolean
	public modifiers?: Modifier[]
	public decorators?: string[]

	addModifier(modifier?: ts.Modifier) {
		if (!modifier) return
		if (!this.modifiers) this.modifiers = []

		switch (modifier.kind) {
			case ts.SyntaxKind.AbstractKeyword:
				this.modifiers.push("Abstract")
				break
			case ts.SyntaxKind.AsyncKeyword:
				this.modifiers.push("Async")
				break
			case ts.SyntaxKind.ConstKeyword:
				this.modifiers.push("Const")
				break
			case ts.SyntaxKind.DefaultKeyword:
				this.modifiers.push("Default")
				break
			case ts.SyntaxKind.ExportKeyword:
				this.modifiers.push("Export")
				break
			case ts.SyntaxKind.PrivateKeyword:
				this.modifiers.push("Private")
				break
			case ts.SyntaxKind.ProtectedKeyword:
				this.modifiers.push("Protected")
				break
			case ts.SyntaxKind.PublicKeyword:
				this.modifiers.push("Public")
				break
			case ts.SyntaxKind.OverrideKeyword:
				this.modifiers.push("Override")
				break
			case ts.SyntaxKind.ReadonlyKeyword:
				this.modifiers.push("Readonly")
				break
			case ts.SyntaxKind.StaticKeyword:
				this.modifiers.push("Static")
				break
		}
	}
}

// atoms
export class UnknownProperty extends AbstractProperty {
	readonly type = "Unknown"
}
export class VoidProperty extends AbstractProperty {
	readonly type = "Void"
}
export class BooleanProperty extends AbstractProperty {
	readonly type = "Boolean"
}
export class NumberProperty extends AbstractProperty {
	readonly type = "Number"
}
export class StringProperty extends AbstractProperty {
	readonly type = "String"
}
export class DateProperty extends AbstractProperty {
	readonly type = "Date"
}
export class BigIntegerProperty extends AbstractProperty {
	readonly type = "BigInteger"
}
export class BlobProperty extends AbstractProperty {
	readonly type = "Blob"
}
export class AnyProperty extends AbstractProperty {
	readonly type = "Any"
}

// molecules
export class RecordProperty extends AbstractProperty {
	readonly type = "Record"
	constructor(public of: Property) {
		super()
	}
}

export class ArrayProperty extends AbstractProperty {
	readonly type = "Array"
	constructor(public of: Property) {
		super()
	}
}

export class TupleProperty extends AbstractProperty {
	readonly type = "Tuple"
	constructor(public of: Property[]) {
		super()
	}
}

export class ObjectProperty extends AbstractProperty {
	readonly type = "Object"
	constructor(public properties: Properties) {
		super()
	}
}

export class MapProperty extends AbstractProperty {
	readonly type = "Map"
	constructor(public key: Property, public value: Property) {
		super()
	}
}

export class SetProperty extends AbstractProperty {
	readonly type = "Set"
	constructor(public of: Property) {
		super()
	}
}

export class UnionProperty extends AbstractProperty {
	readonly type = "Union"
	constructor(public types: Property[]) {
		super()
	}
}

export class FunctionProperty extends AbstractProperty {
	readonly type = "Function"
	constructor(public signatures: FunctionPropertySignature[]) {
		super()
	}
}
