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
import { createProperties } from "../Properties/createProperties"
import { Properties } from "../Properties/Properties"
import { Signature } from "../Signature/Signature"
import { ValidationErrors } from "../ValidationError/ValidationError"
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

	toString(): string {
		return '"' + this.value + '"'
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (value !== this.value) errors.mismatch(value, this.value, path)
		return errors
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

	toString(): string {
		return String(this.value)
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (value !== this.value) errors.mismatch(value, this.value, path)
		return errors
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

	toString(): string {
		return String(this.value)
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (value !== this.value) errors.mismatch(value, this.value, path)
		return errors
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

	toString(): string {
		return String(this.value)
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (value !== this.value) errors.mismatch(value, this.value, path)
		return errors
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

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		return errors
	}
}

export class VoidType extends BaseType {
	readonly type = "Void"

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Void) return new VoidType()
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		return errors
	}
}

export class NullType extends BaseType {
	readonly type = "Null"

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Null) return new NullType()
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (value !== null) errors.mismatch(value, "null", path)
		return errors
	}
}

export class UndefinedType extends BaseType {
	readonly type = "Undefined"

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Undefined) return new UndefinedType()
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (value !== undefined) errors.mismatch(value, "undefined", path)
		return errors
	}
}

export class AnyType extends BaseType {
	readonly type = "Any"

	static fromTsType(tsType: ts.Type) {
		if (tsType.flags & ts.TypeFlags.Any) return new AnyType()
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		return errors
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

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (typeof value !== "boolean") errors.mismatch(value, "a boolean", path)
		return errors
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

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (typeof value !== "number") errors.mismatch(value, "a number", path)
		return errors
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

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (typeof value !== "bigint") errors.mismatch(value, "a big integer", path)
		return errors
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

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (typeof value !== "string") errors.mismatch(value, "a string", path)
		return errors
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

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (!(value instanceof RegExp)) errors.mismatch(value, "a regular expression", path)
		return errors
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

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (!(value instanceof Date)) errors.mismatch(value, "a date", path)
		return errors
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

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (!(value instanceof ArrayBuffer)) errors.mismatch(value, "an array buffer", path)
		return errors
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

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (!value || typeof value !== "object") errors.mismatch(value, "an object", path)
		else {
			for (const key in this.properties) {
				this.properties[key].validate(value[key], path.concat(key), errors)
			}
		}
		return errors
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

	toString(): string {
		return `Record<${this.key.toString()}, ${this.value.toString()}>`
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (!value || typeof value !== "object") errors.mismatch(value, "an record", path)
		else {
			for (const key in value) {
				this.value.validate(value[key], path.concat(key), errors)
			}
		}
		return errors
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

	toString(): string {
		return `Array<${this.of.toString()}>`
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (!Array.isArray(value)) errors.mismatch(value, "an array", path)
		else {
			value.forEach((item, index) => {
				this.of.validate(item, path.concat(String(index)), errors)
			})
		}
		return errors
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

	toString(): string {
		return `[${this.of.map(type => type.toString()).join(", ")}]`
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (!Array.isArray(value)) errors.mismatch(value, "a tuple", path)
		else {
			this.of.forEach((type, index) => {
				type.validate(value[index], path.concat(String(index)), errors)
			})
		}
		return errors
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

	toString(): string {
		return `Map<${(this.key.toString(), this.value.toString())}>`
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (!(value instanceof Map)) errors.mismatch(value, "a map", path)
		else {
			for (const [key, item] of value.entries()) {
				const keyPath = path.concat(!key || typeof key != "object" ? String(key) : "")
				this.key.validate(key, keyPath, errors)
				this.value.validate(item, keyPath, errors)
			}
		}
		return errors
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

	toString(): string {
		return `Set<${this.of.toString()}>`
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (!(value instanceof Set)) errors.mismatch(value, "a set", path)
		else {
			const keyPath = path.concat("")
			for (const key of value) {
				this.of.validate(key, keyPath, errors)
			}
		}
		return errors
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

	toString(): string {
		return this.types.map(type => type.toString()).join(" | ")
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		for (const type of this.types) {
			const typeErrors = type.validate(value, path, new ValidationErrors())
			if (!typeErrors.length) return errors
		}
		errors.mismatch(value, this.toString(), path)
		return errors
	}
}

export class EnumerationType extends BaseType {
	readonly type = "Enumeration"

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

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		for (const type of Object.values(this.properties)) {
			const typeErrors = type.validate(value, path, new ValidationErrors())
			if (!typeErrors.length) return errors
		}
		errors.mismatch(value, this.toString(), path)
		return errors
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

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (typeof value !== "function") errors.mismatch(value, "a function", path)
		return errors
	}
}

export class ClassType extends BaseType {
	readonly type = "Class"

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

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		if (typeof value !== "function") errors.mismatch(value, "a class", path)
		return errors
	}
}
