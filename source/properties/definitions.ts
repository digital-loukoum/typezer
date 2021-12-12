import { Properties } from "./Properties"
import { BaseProperty } from "./BaseProperty"
import { Property } from "./Property"
import { PropertySignature } from "./PropertySignature"
import ts from "typescript"
import { typeMatchFeatures } from "../typeChecker/typeMatchFeatures"

// ---------------------- //
// --    PRIMITIVES    -- //
// ---------------------- //
export class UnknownProperty extends BaseProperty {
	readonly type = "Unknown"

	static fromType(type: ts.Type) {
		if (type.flags & ts.TypeFlags.Unknown) return new UnknownProperty()
	}
}

export class VoidProperty extends BaseProperty {
	readonly type = "Void"

	static fromType(type: ts.Type) {
		if (type.flags & ts.TypeFlags.Void) return new VoidProperty()
	}
}

export class AnyProperty extends BaseProperty {
	readonly type = "Any"

	static fromType(type: ts.Type) {
		if (type.flags & ts.TypeFlags.Any) return new AnyProperty()
	}
}

export class BooleanProperty extends BaseProperty {
	readonly type = "Boolean"

	static fromType(type: ts.Type) {
		// "boolean"
		if (type.flags & ts.TypeFlags.BooleanLike) return new BooleanProperty()
		// "Boolean" - detection by name
		if (type.symbol.name == "Boolean") return new BooleanProperty()
	}
}

export class NumberProperty extends BaseProperty {
	readonly type = "Number"
	static readonly features = [
		"toString",
		"toFixed",
		"toExponential",
		"toPrecision",
		"valueOf",
		"toLocaleString",
	]

	static fromType(type: ts.Type) {
		// "number"
		if (type.flags & ts.TypeFlags.NumberLike) return new NumberProperty()
		// "Number" - detection by name and features
		if (type.symbol.name == "Number" && typeMatchFeatures(type, NumberProperty.features))
			return new NumberProperty()
	}
}

export class BigIntegerProperty extends BaseProperty {
	readonly type = "BigInteger"

	static fromType(type: ts.Type) {
		// "bigint"
		if (type.flags & ts.TypeFlags.BigIntLike) return new BigIntegerProperty()
		// "BigInt" - detection by name
		if (type.symbol.name == "BigInt") return new BigIntegerProperty()
	}
}

export class StringProperty extends BaseProperty {
	readonly type = "String"
	static features = [
		"toString",
		"charAt",
		"charCodeAt",
		"concat",
		"indexOf",
		"lastIndexOf",
		"localeCompare",
		"match",
		"replace",
		"search",
		"slice",
		"split",
		"substring",
		"toLowerCase",
		"toLocaleLowerCase",
		"toUpperCase",
		"toLocaleUpperCase",
		"trim",
		"length",
		"substr",
		"valueOf",
		"codePointAt",
		"includes",
		"endsWith",
		"normalize",
		"repeat",
		"startsWith",
		"anchor",
		"big",
		"blink",
		"bold",
		"fixed",
		"fontcolor",
		"fontsize",
		"italics",
		"link",
		"small",
		"strike",
		"sub",
		"sup",
		"padStart",
		"padEnd",
		"trimLeft",
		"trimRight",
		"trimStart",
		"trimEnd",
	]

	static fromType(type: ts.Type) {
		// "string"
		if (type.flags & ts.TypeFlags.StringLike) return new StringProperty()
		// "String" - detection by name and features
		if (type.symbol.name == "String" && typeMatchFeatures(type, StringProperty.features))
			return new StringProperty()
	}
}

export class RegularExpressionProperty extends BaseProperty {
	readonly type = "RegularExpression"
	static features = [
		"exec",
		"test",
		"source",
		"global",
		"ignoreCase",
		"multiline",
		"lastIndex",
		"compile",
		"flags",
		"sticky",
		"unicode",
		"dotAll",
	]

	static fromType(type: ts.Type) {
		// detection by name and features
		if (
			type.symbol.name == "RegExp" &&
			typeMatchFeatures(type, RegularExpressionProperty.features)
		) {
			return new RegularExpressionProperty()
		}
	}
}

export class DateProperty extends BaseProperty {
	readonly type = "Date"
	static features = [
		"toString",
		"toDateString",
		"toTimeString",
		"toLocaleString",
		"toLocaleDateString",
		"toLocaleTimeString",
		"valueOf",
		"getTime",
		"getFullYear",
		"getUTCFullYear",
		"getMonth",
		"getUTCMonth",
		"getDate",
		"getUTCDate",
		"getDay",
		"getUTCDay",
		"getHours",
		"getUTCHours",
		"getMinutes",
		"getUTCMinutes",
		"getSeconds",
		"getUTCSeconds",
		"getMilliseconds",
		"getUTCMilliseconds",
		"getTimezoneOffset",
		"setTime",
		"setMilliseconds",
		"setUTCMilliseconds",
		"setSeconds",
		"setUTCSeconds",
		"setMinutes",
		"setUTCMinutes",
		"setHours",
		"setUTCHours",
		"setDate",
		"setUTCDate",
		"setMonth",
		"setUTCMonth",
		"setFullYear",
		"setUTCFullYear",
		"toUTCString",
		"toISOString",
		"toJSON",
		"getVarDate",
	]

	static fromType(type: ts.Type) {
		// detection by name and features
		if (type.symbol.name == "Date" && typeMatchFeatures(type, DateProperty.features)) {
			return new DateProperty()
		}
	}
}

export class ArrayBufferProperty extends BaseProperty {
	readonly type = "ArrayBuffer"

	static fromType(type: ts.Type) {
		// detection by name
		if (type.symbol.name == "ArrayBuffer") {
			return new ArrayBufferProperty()
		}
	}
}

// ----------------------- //
// --    COMPOSABLES    -- //
// ----------------------- //
// molecules
export class RecordProperty extends BaseProperty {
	readonly type = "Record"
	constructor(public of: Property) {
		super()
	}

	static fromType(type: ts.Type) {
		return undefined
	}
}

export class ArrayProperty extends BaseProperty {
	readonly type = "Array"
	constructor(public of: Property) {
		super()
	}

	static fromType(type: ts.Type) {
		return undefined
	}
}

export class TupleProperty extends BaseProperty {
	readonly type = "Tuple"
	constructor(public of: Property[]) {
		super()
	}

	static fromType(type: ts.Type) {
		return undefined
	}
}

export class ObjectProperty extends BaseProperty {
	readonly type = "Object"
	constructor(public properties: Properties) {
		super()
	}

	static fromType(type: ts.Type) {
		return undefined
	}
}

export class MapProperty extends BaseProperty {
	readonly type = "Map"
	constructor(public key: Property, public value: Property) {
		super()
	}

	static fromType(type: ts.Type) {
		return undefined
	}
}

export class SetProperty extends BaseProperty {
	readonly type = "Set"
	constructor(public of: Property) {
		super()
	}

	static fromType(type: ts.Type) {
		return undefined
	}
}

export class UnionProperty extends BaseProperty {
	readonly type = "Union"
	constructor(public types: Property[]) {
		super()
	}

	static fromType(type: ts.Type) {
		return undefined
	}
}

export class FunctionProperty extends BaseProperty {
	readonly type = "Function"
	constructor(public signatures: PropertySignature[]) {
		super()
	}

	static fromType(type: ts.Type) {
		return undefined
	}
}
