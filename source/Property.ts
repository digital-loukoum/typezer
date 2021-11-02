import ts from "typescript"

export type Properties = Record<string, Property>

export type FunctionPropertySignature = {
	parameters: Property[]
	returnType: Property
}

export abstract class Property {
	public nullable?: boolean

	constructor(
		public readonly type:
			| "Unknown"
			| "Void"
			| "Boolean"
			| "Number"
			| "String"
			| "Date"
			| "BigInteger"
			| "Blob"
			| "Any"
			| "Record"
			| "Array"
			| "Tuple"
			| "Object"
			| "Map"
			| "Set"
			| "Union"
			| "Class"
			| "Interface"
			| "TypeAlias"
			| "Function"
			| "Nullable",
		nullable?: boolean
	) {
		if (nullable) this.nullable = true
	}

	isArray(): this is ArrayProperty {
		return this.type == "Array"
	}
	isTuple(): this is TupleProperty {
		return this.type == "Tuple"
	}
	isRecord(): this is RecordProperty {
		return this.type == "Record"
	}
	isObject(): this is ObjectProperty {
		return this.type == "Object"
	}
	isMap(): this is MapProperty {
		return this.type == "Map"
	}
	isSet(): this is SetProperty {
		return this.type == "Set"
	}
	isUnion(): this is UnionProperty {
		return this.type == "Union"
	}
	isNullable(): this is NullableProperty {
		return this.type == "Nullable"
	}
}

// atoms
export class UnknownProperty extends Property {
	constructor(nullable?: boolean) {
		super("Unknown", nullable)
	}
}
export class VoidProperty extends Property {
	constructor(nullable?: boolean) {
		super("Void", nullable)
	}
}
export class BooleanProperty extends Property {
	constructor(nullable?: boolean) {
		super("Boolean", nullable)
	}
}
export class NumberProperty extends Property {
	constructor(nullable?: boolean) {
		super("Number", nullable)
	}
}
export class StringProperty extends Property {
	constructor(nullable?: boolean) {
		super("String", nullable)
	}
}
export class DateProperty extends Property {
	constructor(nullable?: boolean) {
		super("Date", nullable)
	}
}
export class BigIntegerProperty extends Property {
	constructor(nullable?: boolean) {
		super("BigInteger", nullable)
	}
}
export class BlobProperty extends Property {
	constructor(nullable?: boolean) {
		super("Blob", nullable)
	}
}
export class AnyProperty extends Property {
	constructor(nullable?: boolean) {
		super("Any", nullable)
	}
}

// molecules
export class RecordProperty extends Property {
	constructor(public of: Property, nullable?: boolean) {
		super("Record", nullable)
	}
}

export class ArrayProperty extends Property {
	constructor(public of: Property, nullable?: boolean) {
		super("Array", nullable)
	}
}

export class TupleProperty extends Property {
	constructor(public of: Property[], nullable?: boolean) {
		super("Tuple", nullable)
	}
}

export class ObjectProperty extends Property {
	constructor(public properties: Properties, nullable?: boolean) {
		super("Object", nullable)
	}
}

export class ClassProperty extends Property {
	constructor(public properties: Properties) {
		super("Class")
	}
}

export class InterfaceProperty extends Property {
	constructor(public properties: Properties) {
		super("Interface")
	}
}

export class TypeAliasProperty extends Property {
	constructor(public aliasOf: Property) {
		super("TypeAlias")
	}
}

export class MapProperty extends Property {
	constructor(public key: Property, public value: Property, nullable?: boolean) {
		super("Map", nullable)
	}
}

export class SetProperty extends Property {
	constructor(public of: Property, nullable?: boolean) {
		super("Set", nullable)
	}
}

export class UnionProperty extends Property {
	constructor(public types: Property[], nullable?: boolean) {
		super("Union", nullable)
	}
}

export class FunctionProperty extends Property {
	constructor(public signatures: FunctionPropertySignature[], nullable?: boolean) {
		super("Function", nullable)
	}
}

export class NullableProperty extends Property {
	constructor(public of: Property, nullable?: boolean) {
		super("Nullable", nullable)
	}
}
