export type Properties = Record<string, Property>

export abstract class Property {
	constructor(
		public readonly type:
			| "Unknown"
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
			| "Nullable",
		public nullable = false
	) {}

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
	constructor(nullable = false) {
		super("Unknown", nullable)
	}
}
export class BooleanProperty extends Property {
	constructor(nullable = false) {
		super("Boolean", nullable)
	}
}
export class NumberProperty extends Property {
	constructor(nullable = false) {
		super("Number", nullable)
	}
}
export class StringProperty extends Property {
	constructor(nullable = false) {
		super("String", nullable)
	}
}
export class DateProperty extends Property {
	constructor(nullable = false) {
		super("Date", nullable)
	}
}
export class BigIntegerProperty extends Property {
	constructor(nullable = false) {
		super("BigInteger", nullable)
	}
}
export class BlobProperty extends Property {
	constructor(nullable = false) {
		super("Blob", nullable)
	}
}
export class AnyProperty extends Property {
	constructor(nullable = false) {
		super("Any", nullable)
	}
}

// molecules
export class RecordProperty extends Property {
	constructor(public of: Property, nullable = false) {
		super("Record", nullable)
	}
}

export class ArrayProperty extends Property {
	constructor(public of: Property, nullable = false) {
		super("Array", nullable)
	}
}

export class TupleProperty extends Property {
	constructor(public of: Property[], nullable = false) {
		super("Tuple", nullable)
	}
}

export class ObjectProperty extends Property {
	constructor(public properties: Properties, nullable = false) {
		super("Object", nullable)
	}
}

export class MapProperty extends Property {
	constructor(public key: Property, public value: Property, nullable = false) {
		super("Map", nullable)
	}
}

export class SetProperty extends Property {
	constructor(public of: Property, nullable = false) {
		super("Set", nullable)
	}
}

export class UnionProperty extends Property {
	constructor(public types: Property[], nullable = false) {
		super("Union", nullable)
	}
}

export class NullableProperty extends Property {
	constructor(public of: Property, nullable = false) {
		super("Nullable", nullable)
	}
}
