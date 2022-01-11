import { Properties } from "./Properties"
import { BaseProperty } from "./BaseProperty"
import { Property } from "./Property"
import { PropertySignature } from "./PropertySignature"
import ts from "typescript"
import { typeMatchFeatures } from "../typeChecker/typeMatchFeatures"
import { typeToString } from "../typeChecker/typeToString"
import { getArrayType, getTypeChecker } from "../typeChecker"
import { Type } from "../Type"
import { getTupleType } from "../typeChecker/getTupleType"
import { getRecordType } from "../typeChecker/getRecordType"
import { getMappedType } from "../typeChecker/getMappedType"

// ---------------------- //
// --     LITERALS     -- //
// ---------------------- //
export class StringLiteralProperty extends BaseProperty {
	readonly type = "StringLiteral"
	static priority = -1

	constructor(public value: string) {
		super()
	}

	static fromType({ type }: Type) {
		if (type.isStringLiteral()) return new StringLiteralProperty(type.value)
	}
}

export class NumberLiteralProperty extends BaseProperty {
	readonly type = "NumberLiteral"
	static priority = -1

	constructor(public value: number) {
		super()
	}

	static fromType({ type }: Type) {
		if (type.isNumberLiteral()) return new NumberLiteralProperty(type.value)
	}
}

export class BigIntegerLiteralProperty extends BaseProperty {
	readonly type = "BigIntegerLiteral"
	static priority = -1

	constructor(public value: string) {
		super()
	}

	static fromType({ type }: Type) {
		if (type.isLiteral() && type.flags & ts.TypeFlags.BigIntLiteral) {
			let value =
				typeof type.value == "object"
					? (type.value.negative ? "-" : "") + type.value.base10Value
					: String(type.value)
			return new BigIntegerLiteralProperty(value)
		}
	}
}

export class BooleanLiteralProperty extends BaseProperty {
	readonly type = "BooleanLiteral"
	static priority = -1

	constructor(public value: boolean) {
		super()
	}

	static fromType({ type }: Type) {
		if (type.flags & ts.TypeFlags.BooleanLiteral) {
			return new BooleanLiteralProperty(
				(type as any).intrinsicName == "true" ? true : false
			)
		}
	}
}

// ---------------------- //
// --    PRIMITIVES    -- //
// ---------------------- //

export class UnknownProperty extends BaseProperty {
	readonly type = "Unknown"

	static fromType({ type }: Type) {
		if (type.flags & ts.TypeFlags.Unknown) return new UnknownProperty()
	}
}

export class VoidProperty extends BaseProperty {
	readonly type = "Void"

	static fromType({ type }: Type) {
		if (type.flags & ts.TypeFlags.Void) return new VoidProperty()
	}
}

export class AnyProperty extends BaseProperty {
	readonly type = "Any"

	static fromType({ type }: Type) {
		if (type.flags & ts.TypeFlags.Any) return new AnyProperty()
	}
}

export class BooleanProperty extends BaseProperty {
	readonly type = "Boolean"

	static fromType({ type }: Type) {
		// "boolean"
		if (type.flags & ts.TypeFlags.BooleanLike) return new BooleanProperty()
		// "Boolean" - detection by name
		if (typeToString(type) == "Boolean") return new BooleanProperty()
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

	static fromType({ type }: Type) {
		// "number"
		if (type.flags & ts.TypeFlags.NumberLike) return new NumberProperty()
		// "Number" - detection by name and features
		if (
			typeToString(type) == "Number" &&
			typeMatchFeatures(type, NumberProperty.features)
		)
			return new NumberProperty()
	}
}

export class BigIntegerProperty extends BaseProperty {
	readonly type = "BigInteger"

	static fromType({ type }: Type) {
		// "bigint"
		if (type.flags & ts.TypeFlags.BigIntLike) return new BigIntegerProperty()
		// "BigInt" - detection by name
		if (typeToString(type) == "BigInt") return new BigIntegerProperty()
	}
}

export class StringProperty extends BaseProperty {
	readonly type = "String"
	static readonly features = [
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

	static fromType({ type }: Type) {
		// "string"
		if (type.flags & ts.TypeFlags.StringLike) return new StringProperty()
		// "String" - detection by name and features
		if (
			typeToString(type) == "String" &&
			typeMatchFeatures(type, StringProperty.features)
		)
			return new StringProperty()
	}
}

export class RegularExpressionProperty extends BaseProperty {
	readonly type = "RegularExpression"
	static readonly features = [
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

	static fromType({ type }: Type) {
		// detection by name and features
		if (
			typeToString(type) == "RegExp" &&
			typeMatchFeatures(type, RegularExpressionProperty.features)
		) {
			return new RegularExpressionProperty()
		}
	}
}

export class DateProperty extends BaseProperty {
	readonly type = "Date"
	static readonly features = [
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

	static fromType({ type }: Type) {
		// detection by name and features
		if (typeToString(type) == "Date" && typeMatchFeatures(type, DateProperty.features)) {
			return new DateProperty()
		}
	}
}

export class ArrayBufferProperty extends BaseProperty {
	readonly type = "ArrayBuffer"

	static fromType({ type }: Type) {
		// detection by name
		if (typeToString(type) == "ArrayBuffer") {
			// TODO Maybe there is a better way to detect array buffers
			return new ArrayBufferProperty()
		}
	}
}

// ----------------------- //
// --    COMPOSABLES    -- //
// ----------------------- //

export class ObjectProperty extends BaseProperty {
	static readonly priority = 100 // only if all other checks failed
	readonly type = "Object"

	constructor(public properties: Properties) {
		super()
	}

	static fromType(type: Type) {
		return new ObjectProperty(type.getProperties())
	}
}

export class RecordProperty extends BaseProperty {
	readonly type = "Record"
	constructor(public key: Property, public value: Property) {
		super()
	}

	static fromType({ type, node }: Type) {
		const recordType = getRecordType(type)
		if (recordType) {
			const [keyType, valueType] = recordType
			return new RecordProperty(
				new Type(keyType, node).toProperty(),
				new Type(valueType, node).toProperty()
			)
		}

		const mappedType = getMappedType(type)
		if (mappedType) {
			const [keyType, valueType] = mappedType

			let keyProperty: Property
			if (keyType.length == 1) keyProperty = new Type(keyType[0], node).toProperty()
			else {
				keyProperty = new UnionProperty(
					keyType.map(type => new Type(type, node).toProperty())
				)
			}

			return new RecordProperty(keyProperty, new Type(valueType, node).toProperty())
		}
	}
}

export class ArrayProperty extends BaseProperty {
	static readonly priority = 10 // after tuple
	readonly type = "Array"
	constructor(public of: Property) {
		super()
	}

	static fromType({ type, node }: Type) {
		const itemsType = getArrayType(type)
		if (itemsType) {
			return new ArrayProperty(new Type(itemsType, node).toProperty())
		}
	}
}

export class TupleProperty extends BaseProperty {
	readonly type = "Tuple"
	constructor(public of: Property[]) {
		super()
	}

	static fromType({ type, node }: Type) {
		const types = getTupleType(type)
		if (types) {
			return new TupleProperty(types.map(type => new Type(type, node).toProperty()))
		}
	}
}

export class MapProperty extends BaseProperty {
	readonly type = "Map"
	static readonly features = [
		"clear",
		"delete",
		"forEach",
		"get",
		"has",
		"set",
		"size",
		"entries",
		"keys",
		"values",
	]

	constructor(public key: Property, public value: Property) {
		super()
	}

	static fromType({ type, node }: Type) {
		if (
			type.symbol?.getEscapedName() == "Map" &&
			typeMatchFeatures(type, MapProperty.features)
		) {
			const [key, value] = getTypeChecker()
				.getTypeArguments(type as ts.TypeReference)
				.map(type => new Type(type, node).toProperty())
			return new MapProperty(key, value)
		}
	}
}

export class SetProperty extends BaseProperty {
	readonly type = "Set"
	static readonly features = [
		"add",
		"clear",
		"delete",
		"forEach",
		"has",
		"size",
		"entries",
		"keys",
		"values",
	]

	constructor(public of: Property) {
		super()
	}

	static fromType({ type, node }: Type) {
		if (
			type.symbol?.getEscapedName() == "Set" &&
			typeMatchFeatures(type, SetProperty.features)
		) {
			const [key] = getTypeChecker().getTypeArguments(type as ts.TypeReference)
			return new SetProperty(new Type(key, node).toProperty())
		}
	}
}

export class UnionProperty extends BaseProperty {
	readonly type = "Union"
	constructor(public types: Property[]) {
		super()
	}

	static fromType({ type, node }: Type) {
		if (type.isUnion()) {
			return new UnionProperty(type.types.map(type => new Type(type, node).toProperty()))
		}
		return undefined
	}
}

export class FunctionProperty extends BaseProperty {
	readonly type = "Function"
	constructor(public signatures: PropertySignature[]) {
		super()
	}

	static fromType({ type, node }: Type) {
		const signatures = type.getCallSignatures()
		if (signatures?.length) {
		}
	}
}
