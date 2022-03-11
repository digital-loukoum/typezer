import ts from "typescript"
import { getArrayType } from "../../utilities/getArrayType"
import { getMappedType } from "../../utilities/getMappedType"
import { getRecordType } from "../../utilities/getRecordType"
import { getTupleType } from "../../utilities/getTupleType"
import { getTypeOfSymbol } from "../../utilities/getTypeOfSymbol"
import { serializeTemplateLiteral } from "../../utilities/serializeTemplateLiteral"
import { getTypeChecker } from "../../utilities/typeChecker"
import { typeMatchFeatures } from "../../utilities/typeMatchFeatures"
import { methodReturnTypeMatchesFlags } from "../../utilities/methodReturnTypeMatchesFlags"
import { Definition } from "../Definition/Definition"
import { createProperties } from "../Properties/createProperties"
import { Properties } from "../Properties/Properties"
import { Signature } from "../Signature/Signature"
import { BaseType } from "./BaseType"
import { createManyTypes } from "./createManyTypes"
import { createType } from "./createType"
import { Type } from "./Type"
import { getReturnTypeOfMethod } from "../../utilities/getReturnTypeOfMethod"
import { definitions } from "../Definition/definitions"

// ---------------------- //
// --     LITERALS     -- //
// ---------------------- //
export class VoidType extends BaseType {
	static readonly typeName = "Void"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Void) return new VoidType()
	}
}

export class NullType extends BaseType {
	static readonly typeName = "Null"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Null) return new NullType()
	}
}

export class UndefinedType extends BaseType {
	static readonly typeName = "Undefined"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Undefined) return new UndefinedType()
	}
}

export class StringLiteralType extends BaseType {
	static readonly typeName = "StringLiteral"
	static priority = 10
	static isPrimitive = true

	constructor(public value: string) {
		super()
	}

	static fromTsType(tsType: ts.Type) {
		if (tsType.isStringLiteral()) return new StringLiteralType(tsType.value)
	}

	toString(): string {
		return '"' + this.value + '"'
	}
}

export class TemplateLiteralType extends BaseType {
	static readonly typeName = "TemplateLiteral"
	static priority = 10
	static isPrimitive = true

	constructor(
		public texts: Array<string>,
		public types: Array<"string" | "number" | "bigint">
	) {
		super()
	}

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.TemplateLiteral) {
			const tsTemplateLiteral = tsType as ts.TemplateLiteralType
			const texts = tsTemplateLiteral.texts as Array<string>
			const types = tsTemplateLiteral.types.map(type =>
				type.flags & ts.TypeFlags.Number
					? "number"
					: type.flags & ts.TypeFlags.String
					? "string"
					: "bigint"
			)
			return new TemplateLiteralType(texts, types)
		}
	}

	toString(): string {
		return serializeTemplateLiteral(this.texts, this.types)
	}
}

export class NumberLiteralType extends BaseType {
	static readonly typeName = "NumberLiteral"
	static priority = 10
	static isPrimitive = true

	constructor(public value: number) {
		super()
	}

	static fromTsType(tsType: ts.Type) {
		if (tsType.isNumberLiteral()) return new NumberLiteralType(tsType.value)
	}

	toString(): string {
		return String(this.value)
	}
}

export class BigIntegerLiteralType extends BaseType {
	static readonly typeName = "BigIntegerLiteral"
	static priority = 10
	static isPrimitive = true

	constructor(public value: string) {
		super()
	}

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.BigIntLiteral) {
			const literal = tsType as ts.LiteralType
			let value =
				typeof literal.value == "object"
					? (literal.value.negative ? "-" : "") + literal.value.base10Value
					: String(literal.value)
			return new BigIntegerLiteralType(value)
		}
	}

	toString(): string {
		return String(this.value)
	}
}

export class BooleanLiteralType extends BaseType {
	static readonly typeName = "BooleanLiteral"
	static priority = 10
	static isPrimitive = true

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

	toString(): string {
		return String(this.value)
	}
}

// ---------------------- //
// --    PRIMITIVES    -- //
// ---------------------- //

export class UnknownType extends BaseType {
	static readonly typeName = "Unknown"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Unknown) return new UnknownType()
	}
}

export class AnyType extends BaseType {
	static readonly typeName = "Any"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Any) return new AnyType()
	}
}

export class BooleanType extends BaseType {
	static readonly typeName = "Boolean"
	static priority = 6 // before union (because a boolean is considered a true | false union)
	static isPrimitive = true

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		if (
			tsType.flags & ts.TypeFlags.BooleanLike ||
			methodReturnTypeMatchesFlags(tsType, tsNode, "valueOf", ts.TypeFlags.BooleanLike)
		)
			return new BooleanType()
	}
}

export class NumberType extends BaseType {
	static readonly typeName = "Number"
	static isPrimitive = true
	static readonly features = [
		"toString",
		"toFixed",
		"toExponential",
		"toPrecision",
		"valueOf",
		"toLocaleString",
	]

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.NumberLike) return new NumberType()
		if (typeMatchFeatures(tsType, NumberType.features)) return new NumberType()
	}
}

export class BigIntegerType extends BaseType {
	static readonly typeName = "BigInteger"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		if (
			tsType.flags & ts.TypeFlags.BigIntLike ||
			methodReturnTypeMatchesFlags(tsType, tsNode, "valueOf", ts.TypeFlags.BigIntLike)
		)
			return new BigIntegerType()
	}
}

export class StringType extends BaseType {
	static readonly typeName = "String"
	static isPrimitive = true
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
		if (
			tsType.flags & ts.TypeFlags.StringLike ||
			typeMatchFeatures(tsType, StringType.features)
		) {
			return new StringType()
		}
	}
}
export class RegularExpressionType extends BaseType {
	static readonly typeName = "RegularExpression"
	static isPrimitive = true
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

	constructor() {
		super()
	}

	static fromTsType(tsType: ts.Type) {
		if (typeMatchFeatures(tsType, RegularExpressionType.features)) {
			return new RegularExpressionType()
		}
	}
}

export class DateType extends BaseType {
	static readonly typeName = "Date"
	static isPrimitive = true
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
		if (typeMatchFeatures(tsType, DateType.features)) {
			return new DateType()
		}
	}
}

export class ArrayBufferType extends BaseType {
	static readonly typeName = "ArrayBuffer"
	static isPrimitive = true
	static readonly features = ["slice", "byteLength"]

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		if (
			typeMatchFeatures(tsType, ArrayBufferType.features) &&
			getReturnTypeOfMethod(tsType, tsNode, "slice")?.symbol.escapedName == "ArrayBuffer"
		) {
			return new ArrayBufferType()
		}
	}
}

// ----------------------- //
// --    COMPOSABLES    -- //
// ----------------------- //

export class ObjectType extends BaseType {
	static readonly typeName = "Object"

	constructor(public properties: Properties) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		return new ObjectType(createProperties(tsType, tsNode))
	}
}

export class RecordType extends BaseType {
	static readonly typeName = "Record"
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

	toString(): string {
		return `Record<${this.key.toString()}, ${this.value.toString()}>`
	}
}

export class ArrayType extends BaseType {
	static readonly priority = -10 // after tuple
	static readonly typeName = "Array"

	constructor(public of: Type) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		const itemsType = getArrayType(tsType)
		if (itemsType) {
			return new ArrayType(createType(itemsType, tsNode))
		}
	}

	toString(): string {
		return `Array<${this.of.toString()}>`
	}
}

export class TupleType extends BaseType {
	static readonly typeName = "Tuple"

	constructor(public of: Type[]) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		const tsTypes = getTupleType(tsType)
		if (tsTypes) {
			return new TupleType(createManyTypes(tsTypes, tsNode))
		}
	}

	toString(): string {
		return `[${this.of.map(type => type.toString()).join(", ")}]`
	}
}

export class MapType extends BaseType {
	static readonly typeName = "Map"
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

	toString(): string {
		return `Map<${(this.key.toString(), this.value.toString())}>`
	}
}

export class SetType extends BaseType {
	static readonly typeName = "Set"
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

	toString(): string {
		return `Set<${this.of.toString()}>`
	}
}

export class UnionType extends BaseType {
	static readonly typeName = "Union"
	static priority = 5
	constructor(public types: Type[]) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		if (tsType.isUnion()) {
			return new UnionType(createManyTypes(tsType.types, tsNode))
		}
	}

	toString(): string {
		return this.types.map(type => type.toString()).join(" | ")
	}
}

export class EnumerationType extends BaseType {
	static readonly typeName = "Enumeration"

	constructor(public properties: Properties) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		if (tsType.flags & ts.TypeFlags.EnumLike) {
			const properties: Properties = {}

			if (tsType.isUnion()) {
				tsType.types.forEach(tsProperty => {
					const name = String(tsProperty.symbol.escapedName)
					properties[name] = createType(tsProperty, tsNode)
				})
			} else {
				// enumeration of numbers that may not be constant
				tsType.symbol.exports?.forEach((tsSymbol, tsName) => {
					const name = String(tsName)
					const value = getTypeChecker().getConstantValue(
						tsSymbol.valueDeclaration as ts.EnumMember
					)
					if (value === undefined) {
						properties[name] = new NumberType()
					} else if (typeof value == "string") {
						properties[name] = new StringLiteralType(value)
					} else {
						properties[name] = new NumberLiteralType(value)
					}
				})
			}

			return new EnumerationType(properties)
		}
	}

	toString(): string {
		return `Enum<${Object.values(this.properties)
			.map(type => type.toString())
			.join(" | ")}>`
	}
}

export class FunctionType extends BaseType {
	static readonly typeName = "Function"

	constructor(public signatures: Signature[]) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		const rawSignatures = tsType.getCallSignatures()
		if (rawSignatures?.length) {
			// console.log("Function type:", tsType)
			const signatures: Signature[] = rawSignatures.map(signature => {
				// signature
				// 	.getParameters()
				// 	.forEach(tsSymbol =>
				// 		console.log("Parameter type:", getTypeOfSymbol(tsSymbol, tsNode))
				// 	)
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

/**
 * Class as value (not a type declaration, do not mix up with a class declaration)
 */
export class ClassType extends BaseType {
	static readonly typeName = "Class"

	constructor(public signatures: Signature[], public properties: Properties) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		const rawSignatures = tsType.getConstructSignatures()

		if (rawSignatures?.length) {
			const signatures: Signature[] = rawSignatures.map(signature => {
				const parameters = signature
					.getParameters()
					.map(tsSymbol => createType(getTypeOfSymbol(tsSymbol, tsNode), tsNode))
				const returnType = createType(signature.getReturnType(), tsNode)
				return { parameters, returnType }
			})

			const properties = createProperties(tsType, tsNode)

			return new ClassType(signatures, properties)
		}
	}
}

// ----------------------- //
// --      SPECIALS     -- //
// ----------------------- //

export class ResolvingType extends BaseType {
	static readonly typeName = "Resolving..."

	constructor(id: number) {
		super()
		this.id = id
	}

	static fromTsType() {
		return undefined
	}
}

export class ReferenceType extends BaseType {
	static readonly typeName = "Reference"
	public reference: string

	constructor(definition: Definition) {
		super()
		this.reference = definitions.findDefinitionName(definition.id)!
	}

	static fromTsType() {
		return undefined
	}
}
