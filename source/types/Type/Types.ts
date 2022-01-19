import ts from "typescript"
import { getArrayType } from "../../utilities/getArrayType"
import { getMappedType } from "../../utilities/getMappedType"
import { getRecordType } from "../../utilities/getRecordType"
import { getTupleType } from "../../utilities/getTupleType"
import { getTypeOfSymbol } from "../../utilities/getTypeOfSymbol"
import { mismatch } from "../../utilities/mismatch"
import { getTypeChecker } from "../../utilities/typeChecker"
import { typeMatchFeatures } from "../../utilities/typeMatchFeatures"
import { typeToString } from "../../utilities/typeToString"
import { Definition } from "../Definition/Definition"
import { definitions } from "../Definition/definitions"
import { getDefinitionNameId } from "../Definition/getDefinitionNameId"
import { createProperties } from "../Properties/createProperties"
import { Properties } from "../Properties/Properties"
import { Signature } from "../Signature/Signature"
import { Validator } from "../Validator/Validator"
import { BaseType } from "./BaseType"
import { createManyTypes } from "./createManyTypes"
import { createType } from "./createType"
import { createTypeFromPlainObject, PlainType } from "./createTypeFromPlainObject"
import { Type } from "./Type"

// ---------------------- //
// --     LITERALS     -- //
// ---------------------- //

export class StringLiteralType extends BaseType {
	static readonly type = "StringLiteral"
	static priority = 1
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

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (value !== this.value) validator.mismatch(value, this.value, path)
		return validator
	}
}

export class NumberLiteralType extends BaseType {
	static readonly type = "NumberLiteral"
	static priority = 1
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

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (value !== this.value) validator.mismatch(value, this.value, path)
		return validator
	}
}

export class BigIntegerLiteralType extends BaseType {
	static readonly type = "BigIntegerLiteral"
	static priority = 1
	static isPrimitive = true

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

	toString(): string {
		return String(this.value)
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (value !== this.value) validator.mismatch(value, this.value, path)
		return validator
	}
}

export class BooleanLiteralType extends BaseType {
	static readonly type = "BooleanLiteral"
	static priority = 1
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

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (value !== this.value) validator.mismatch(value, this.value, path)
		return validator
	}
}

// ---------------------- //
// --    PRIMITIVES    -- //
// ---------------------- //

export class UnknownType extends BaseType {
	static readonly type = "Unknown"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Unknown) return new UnknownType()
	}
}

export class VoidType extends BaseType {
	static readonly type = "Void"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Void) return new VoidType()
	}
}

export class NullType extends BaseType {
	static readonly type = "Null"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Null) return new NullType()
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (value !== null) validator.mismatch(value, "null", path)
		return validator
	}
}

export class UndefinedType extends BaseType {
	static readonly type = "Undefined"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Undefined) return new UndefinedType()
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (value !== undefined) validator.mismatch(value, "undefined", path)
		return validator
	}
}

export class AnyType extends BaseType {
	static readonly type = "Any"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Any) return new AnyType()
	}
}

export class BooleanType extends BaseType {
	static readonly type = "Boolean"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type) {
		// "boolean"
		if (tsType.flags & ts.TypeFlags.BooleanLike) return new BooleanType()
		// "Boolean" - detection by name
		if (typeToString(tsType) == "Boolean") return new BooleanType()
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (typeof value !== "boolean") validator.mismatch(value, "a boolean", path)
		return validator
	}
}

export class NumberType extends BaseType {
	static readonly type = "Number"
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
		// "number"
		if (tsType.flags & ts.TypeFlags.NumberLike) return new NumberType()
		// "Number" - detection by name and features
		if (
			typeToString(tsType) == "Number" &&
			typeMatchFeatures(tsType, NumberType.features)
		)
			return new NumberType()
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (typeof value !== "number") validator.mismatch(value, "a number", path)
		return validator
	}
}

export class BigIntegerType extends BaseType {
	static readonly type = "BigInteger"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type) {
		// "bigint"
		if (tsType.flags & ts.TypeFlags.BigIntLike) return new BigIntegerType()
		// "BigInt" - detection by name
		if (typeToString(tsType) == "BigInt") return new BigIntegerType()
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (typeof value !== "bigint") validator.mismatch(value, "a big integer", path)
		return validator
	}
}

export class StringType extends BaseType {
	static readonly type = "String"
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
		// "string"
		if (tsType.flags & ts.TypeFlags.StringLike) return new StringType()
		// "String" - detection by name and features
		if (
			typeToString(tsType) == "String" &&
			typeMatchFeatures(tsType, StringType.features)
		)
			return new StringType()
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (typeof value !== "string") validator.mismatch(value, "a string", path)
		return validator
	}
}

export class RegularExpressionType extends BaseType {
	static readonly type = "RegularExpression"
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

	constructor(public expression: string, public flags: string) {
		super()
	}

	static fromTsType(tsType: ts.Type) {
		if (
			typeToString(tsType) == "RegExp" &&
			typeMatchFeatures(tsType, RegularExpressionType.features)
		) {
			console.log("tsType (regular expresion)", tsType)
			throw "TODO: Regular expression" // TODO
			// return new RegularExpressionType()
		}
		return undefined
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (!(value instanceof RegExp))
			validator.mismatch(value, "a regular expression", path)
		return validator
	}
}

export class DateType extends BaseType {
	static readonly type = "Date"
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
		// detection by name and features
		if (typeToString(tsType) == "Date" && typeMatchFeatures(tsType, DateType.features)) {
			return new DateType()
		}
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (!(value instanceof Date)) validator.mismatch(value, "a date", path)
		return validator
	}
}

export class ArrayBufferType extends BaseType {
	static readonly type = "ArrayBuffer"
	static isPrimitive = true

	static fromTsType(tsType: ts.Type) {
		// detection by name
		if (typeToString(tsType) == "ArrayBuffer") {
			// TODO Maybe there is a better way to detect array buffers
			return new ArrayBufferType()
		}
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (!(value instanceof ArrayBuffer))
			validator.mismatch(value, "an array buffer", path)
		return validator
	}
}

// ----------------------- //
// --    COMPOSABLES    -- //
// ----------------------- //

export class ObjectType extends BaseType {
	static readonly type = "Object"

	constructor(public properties: Properties) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		return new ObjectType(createProperties(tsType, tsNode))
	}

	static fromPlainObject(object: PlainType & { properties: Record<string, PlainType> }) {
		const properties: Properties = {}
		for (const key in object.properties) {
			properties[key] = createTypeFromPlainObject(object.properties[key])
		}
		return new ObjectType(properties)
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (!value || typeof value !== "object") validator.mismatch(value, "an object", path)
		else {
			for (const key in this.properties) {
				validator.validate(this.properties[key], value[key], path.concat(key))
			}
		}
		return validator
	}
}

export class RecordType extends BaseType {
	static readonly type = "Record"
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

	static fromPlainObject(object: PlainType & { key: PlainType; value: PlainType }) {
		return new RecordType(
			createTypeFromPlainObject(object.key),
			createTypeFromPlainObject(object.value)
		)
	}

	toString(): string {
		return `Record<${this.key.toString()}, ${this.value.toString()}>`
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (!value || typeof value !== "object") validator.mismatch(value, "an record", path)
		else {
			for (const key in value) {
				validator.validate(this.value, value[key], path.concat(key))
			}
		}
		return validator
	}
}

export class ArrayType extends BaseType {
	static readonly priority = -10 // after tuple
	static readonly type = "Array"

	constructor(public of: Type) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		const itemsType = getArrayType(tsType)
		if (itemsType) {
			return new ArrayType(createType(itemsType, tsNode))
		}
	}

	static fromPlainObject(object: PlainType & { of: PlainType }) {
		return new ArrayType(createTypeFromPlainObject(object.of))
	}

	toString(): string {
		return `Array<${this.of.toString()}>`
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (!Array.isArray(value)) validator.mismatch(value, "an array", path)
		else {
			value.forEach((item, index) => {
				validator.validate(this.of, item, path.concat(String(index)))
			})
		}
		return validator
	}
}

export class TupleType extends BaseType {
	static readonly type = "Tuple"

	constructor(public of: Type[]) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		const tsTypes = getTupleType(tsType)
		if (tsTypes) {
			return new TupleType(createManyTypes(tsTypes, tsNode))
		}
	}

	static fromPlainObject(object: PlainType & { of: PlainType[] }) {
		return new TupleType(object.of.map(object => createTypeFromPlainObject(object)))
	}

	toString(): string {
		return `[${this.of.map(type => type.toString()).join(", ")}]`
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (!Array.isArray(value)) validator.mismatch(value, "a tuple", path)
		else {
			this.of.forEach((type, index) => {
				validator.validate(type, value[index], path.concat(String(index)))
			})
		}
		return validator
	}
}

export class MapType extends BaseType {
	static readonly type = "Map"
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

	static fromPlainObject(object: PlainType & { key: PlainType; value: PlainType }) {
		return new MapType(
			createTypeFromPlainObject(object.key),
			createTypeFromPlainObject(object.value)
		)
	}

	toString(): string {
		return `Map<${(this.key.toString(), this.value.toString())}>`
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (!(value instanceof Map)) validator.mismatch(value, "a map", path)
		else {
			for (const [key, item] of value.entries()) {
				const keyPath = path.concat(!key || typeof key != "object" ? String(key) : "")
				validator.validate(this.key, key, keyPath)
				validator.validate(this.value, item, keyPath)
			}
		}
		return validator
	}
}

export class SetType extends BaseType {
	static readonly type = "Set"
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

	static fromPlainObject(object: PlainType & { of: PlainType }) {
		return new SetType(createTypeFromPlainObject(object.of))
	}

	toString(): string {
		return `Set<${this.of.toString()}>`
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (!(value instanceof Set)) validator.mismatch(value, "a set", path)
		else {
			const keyPath = path.concat("")
			for (const key of value) {
				validator.validate(this.of, key, keyPath)
			}
		}
		return validator
	}
}

export class UnionType extends BaseType {
	static readonly type = "Union"
	constructor(public types: Type[]) {
		super()
	}

	static fromTsType(tsType: ts.Type, tsNode: ts.Node) {
		if (tsType.isUnion()) {
			return new UnionType(createManyTypes(tsType.types, tsNode))
		}
	}

	static fromPlainObject(object: PlainType & { types: PlainType[] }) {
		return new UnionType(object.types.map(object => createTypeFromPlainObject(object)))
	}

	toString(): string {
		return this.types.map(type => type.toString()).join(" | ")
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		for (const type of this.types) {
			const check = validator.fork().validate(type, value, path)
			if (!check.errors.length) return validator
		}
		validator.mismatch(value, this.toString(), path)
		return validator
	}
}

export class EnumerationType extends BaseType {
	static readonly type = "Enumeration"

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

	static fromPlainObject(object: PlainType & { properties: Record<string, PlainType> }) {
		const properties: Properties = {}
		for (const key in object.properties) {
			properties[key] = createTypeFromPlainObject(object.properties[key])
		}
		return new EnumerationType(properties)
	}

	toString(): string {
		return `Enum<${Object.values(this.properties)
			.map(type => type.toString())
			.join(" | ")}>`
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		for (const type of Object.values(this.properties)) {
			const check = validator.fork().validate(type, value, path)
			if (!check.errors.length) return validator
		}
		validator.mismatch(value, this.toString(), path)
		return validator
	}
}

export class FunctionType extends BaseType {
	static readonly type = "Function"

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

	static fromPlainObject(
		object: PlainType & {
			signatures: {
				parameters: PlainType[]
				returnType: PlainType
			}[]
		}
	) {
		const signatures: Signature[] = []
		for (const { parameters, returnType } of object.signatures) {
			signatures.push({
				parameters: parameters.map(parameter => createTypeFromPlainObject(parameter)),
				returnType: createTypeFromPlainObject(returnType),
			})
		}
		return new FunctionType(signatures)
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (typeof value !== "function") validator.mismatch(value, "a function", path)
		return validator
	}
}

/**
 * Class as value (not a type declaration, do not mix up with a class declaration)
 */
export class ClassType extends BaseType {
	static readonly type = "Class"

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

	static fromPlainObject(
		object: PlainType & {
			properties: Record<string, PlainType>
			signatures: {
				parameters: PlainType[]
				returnType: PlainType
			}[]
		}
	) {
		const signatures: Signature[] = []
		for (const { parameters, returnType } of object.signatures) {
			signatures.push({
				parameters: parameters.map(parameter => createTypeFromPlainObject(parameter)),
				returnType: createTypeFromPlainObject(returnType),
			})
		}

		const properties: Properties = {}
		for (const key in object.properties) {
			properties[key] = createTypeFromPlainObject(object.properties[key])
		}

		return new ClassType(signatures, properties)
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		if (typeof value !== "function") validator.mismatch(value, "a class", path)
		return validator
	}
}

// ----------------------- //
// --      SPECIALS     -- //
// ----------------------- //

export class ResolvingType extends BaseType {
	static readonly type = "Resolving..."

	constructor(id: number) {
		super()
		this.id = id
	}

	static fromTsType() {
		return undefined
	}
}

export class ReferenceType extends BaseType {
	static readonly type = "Reference"
	public reference: string

	constructor(definition: Definition) {
		super()
		this.reference = getDefinitionNameId(definition.name, definition.id)
	}

	static fromTsType() {
		return undefined
	}

	validate(value: any, path: string[] = [], validator = new Validator()) {
		const definition = definitions[this.reference]
		if (definition) {
			validator.validate(definition.type, value, path)
		}
		return validator
	}
}
