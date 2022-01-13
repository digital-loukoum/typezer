import ts from "typescript"
import { getArrayType } from "../../utilities/getArrayType"
import { getMappedType } from "../../utilities/getMappedType"
import { getRecordType } from "../../utilities/getRecordType"
import { getTupleType } from "../../utilities/getTupleType"
import { getTypeOfSymbol } from "../../utilities/getTypeOfSymbol"
import { getTypeChecker } from "../../utilities/typeChecker"
import { typeMatchFeatures } from "../../utilities/typeMatchFeatures"
import { typeToString } from "../../utilities/typeToString"
import { createProperties } from "../Properties/createProperties"
import { Properties } from "../Properties/Properties"
import { Signature } from "../Signature/Signature"
import { BaseType } from "./BaseType"
import { createManyTypes } from "./createManyTypes"
import { createType } from "./createType"
import { Type } from "./Type"

// ---------------------- //
// --     LITERALS     -- //
// ---------------------- //

export class StringLiteralType extends BaseType {
	readonly type = "StringLiteral"
	static priority = 1

	constructor(public value: string) {
		super()
	}

	static fromTsType(tsType: ts.Type) {
		if (tsType.isStringLiteral()) return new StringLiteralType(tsType.value)
	}
}

export class NumberLiteralType extends BaseType {
	readonly type = "NumberLiteral"
	static priority = 1

	constructor(public value: number) {
		super()
	}

	static fromTsType(tsType: ts.Type) {
		if (tsType.isNumberLiteral()) return new NumberLiteralType(tsType.value)
	}
}

export class BigIntegerLiteralType extends BaseType {
	readonly type = "BigIntegerLiteral"
	static priority = 1

	constructor(public value: string) {
		super()
	}

	static fromTsType(tsType: ts.Type) {
		if (tsType.isLiteral() && tsType.flags & ts.TypeFlags.BigIntLiteral) {
			let value =
				typeof tsType.value == "object"
					? (tsType.value.negative ? "-" : "") + tsType.value.base10Value
					: String(tsType.value)
			return new BigIntegerLiteralType(value)
		}
	}
}

export class BooleanLiteralType extends BaseType {
	readonly type = "BooleanLiteral"
	static priority = 1

	constructor(public value: boolean) {
		super()
	}

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.BooleanLiteral) {
			return new BooleanLiteralType(
				(tsType as any).intrinsicName == "true" ? true : false
			)
		}
	}
}

// ---------------------- //
// --    PRIMITIVES    -- //
// ---------------------- //

export class UnknownType extends BaseType {
	readonly type = "Unknown"

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Unknown) return new UnknownType()
	}
}

export class VoidType extends BaseType {
	readonly type = "Void"

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Void) return new VoidType()
	}
}

export class AnyType extends BaseType {
	readonly type = "Any"

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Any) return new AnyType()
	}
}

export class BooleanType extends BaseType {
	readonly type = "Boolean"

	static fromTsType(tsType: ts.Type) {
		// "boolean"
		if (tsType.flags & ts.TypeFlags.BooleanLike) return new BooleanType()
		// "Boolean" - detection by name
		if (typeToString(tsType) == "Boolean") return new BooleanType()
	}
}

export class NumberType extends BaseType {
	readonly type = "Number"
	static readonly features = [
		"toString",
		"toFixed",
		"toExponential",
		"toPrecision",
		"valueOf",
		"toLocaleString",
	]

	static fromTsType(tsType: ts.Type) {
		// "number"
		if (tsType.flags & ts.TypeFlags.NumberLike) return new NumberType()
		// "Number" - detection by name and features
		if (
			typeToString(tsType) == "Number" &&
			typeMatchFeatures(tsType, NumberType.features)
		)
			return new NumberType()
	}
}

export class BigIntegerType extends BaseType {
	readonly type = "BigInteger"

	static fromTsType(tsType: ts.Type) {
		// "bigint"
		if (tsType.flags & ts.TypeFlags.BigIntLike) return new BigIntegerType()
		// "BigInt" - detection by name
		if (typeToString(tsType) == "BigInt") return new BigIntegerType()
	}
}

export class StringType extends BaseType {
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

	static fromTsType(tsType: ts.Type) {
		// "string"
		if (tsType.flags & ts.TypeFlags.StringLike) return new StringType()
		// "String" - detection by name and features
		if (
			typeToString(tsType) == "String" &&
			typeMatchFeatures(tsType, StringType.features)
		)
			return new StringType()
	}
}

export class RegularExpressionType extends BaseType {
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

	static fromTsType(tsType: ts.Type) {
		// detection by name and features
		if (
			typeToString(tsType) == "RegExp" &&
			typeMatchFeatures(tsType, RegularExpressionType.features)
		) {
			return new RegularExpressionType()
		}
	}
}

export class DateType extends BaseType {
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

	static fromTsType(tsType: ts.Type) {
		// detection by name and features
		if (typeToString(tsType) == "Date" && typeMatchFeatures(tsType, DateType.features)) {
			return new DateType()
		}
	}
}

export class ArrayBufferType extends BaseType {
	readonly type = "ArrayBuffer"

	static fromTsType(tsType: ts.Type) {
		// detection by name
		if (typeToString(tsType) == "ArrayBuffer") {
			// TODO Maybe there is a better way to detect array buffers
			return new ArrayBufferType()
		}
	}
}

// ----------------------- //
// --    COMPOSABLES    -- //
// ----------------------- //

export class ObjectType extends BaseType {
	readonly type = "Object"

	constructor(public properties: Properties) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		return new ObjectType(createProperties(tsType, tsNode))
	}
}

export class RecordType extends BaseType {
	readonly type = "Record"
	constructor(public key: Type, public value: Type) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		const recordType = getRecordType(tsType)
		if (recordType) {
			const [keyType, valueType] = createManyTypes(recordType, tsNode)
			return new RecordType(keyType, valueType)
		}

		const mappedType = getMappedType(tsType)
		if (mappedType) {
			const [tsKeyType, tsValueType] = mappedType

			let keyType: Type
			if (tsKeyType.length == 1) {
				keyType = createType(tsKeyType[0], tsNode)
			} else {
				keyType = new UnionType(createManyTypes(tsKeyType, tsNode))
			}
			const valueType = createType(tsValueType, tsNode)

			return new RecordType(keyType, valueType)
		}
	}
}

export class ArrayType extends BaseType {
	static readonly priority = -10 // after tuple
	readonly type = "Array"
	constructor(public of: Type) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		const itemsType = getArrayType(tsType)
		if (itemsType) {
			return new ArrayType(createType(itemsType, tsNode))
		}
	}
}

export class TupleType extends BaseType {
	readonly type = "Tuple"
	constructor(public of: Type[]) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		const tsTypes = getTupleType(tsType)
		if (tsTypes) {
			return new TupleType(createManyTypes(tsTypes, tsNode))
		}
	}
}

export class MapType extends BaseType {
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

	constructor(public key: Type, public value: Type) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		if (
			tsType.symbol?.getEscapedName() == "Map" &&
			typeMatchFeatures(tsType, MapType.features)
		) {
			const [key, value] = createManyTypes(
				getTypeChecker().getTypeArguments(tsType as ts.TypeReference),
				tsNode
			)
			return new MapType(key, value)
		}
	}
}

export class SetType extends BaseType {
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

	constructor(public of: Type) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		if (
			tsType.symbol?.getEscapedName() == "Set" &&
			typeMatchFeatures(tsType, SetType.features)
		) {
			const of = createType(
				getTypeChecker().getTypeArguments(tsType as ts.TypeReference)[0],
				tsNode
			)
			return new SetType(of)
		}
	}
}

export class UnionType extends BaseType {
	readonly type = "Union"
	constructor(public types: Type[]) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		if (tsType.isUnion()) {
			return new UnionType(createManyTypes(tsType.types, tsNode))
		}
	}
}

export class FunctionType extends BaseType {
	readonly type = "Function"
	constructor(public signatures: Signature[]) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		const rawSignatures = tsType.getCallSignatures()
		if (rawSignatures?.length) {
			const signatures: Signature[] = rawSignatures.map(signature => {
				const parameters = signature
					.getParameters()
					.map(tsSymbol => createType(getTypeOfSymbol(tsSymbol, tsNode), tsNode))
				const returnType = createType(signature.getReturnType(), tsNode)
				return { parameters, returnType }
			})
			return new FunctionType(signatures)
		}
	}
}
