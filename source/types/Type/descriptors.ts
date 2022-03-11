import ts from "typescript"
import { getMappedType } from "../../utilities/getMappedType"
import { getRecordType } from "../../utilities/getRecordType"
import { typeMatchFeatures } from "../../utilities/typeMatchFeatures"
import { Properties } from "../Properties/Properties"
import { Signature } from "../Signature/Signature"
import { Typezer } from "../Typezer/Typezer"
import { Type, TypeName, Types } from "./Type"

export type TypeDescriptor<Type> = {
	priority?: number
	create?: (rawType: ts.Type, node: ts.Node) => Type | undefined
}

export function typeDescriptors(this: Typezer): {
	[Key in TypeName]: TypeDescriptor<Types[Key]>
} {
	return {
		// ---------------------- //
		// --     LITERALS     -- //
		// ---------------------- //
		Void: {
			create: (rawType: ts.Type, node: ts.Node) => {
				if (rawType.flags & ts.TypeFlags.Void) return { typeName: "Void" }
			},
		},

		Null: {
			create: (rawType: ts.Type, node: ts.Node) => {
				if (rawType.flags & ts.TypeFlags.Null) return { typeName: "Null" }
			},
		},

		Undefined: {
			create: (rawType: ts.Type) => {
				if (rawType.flags & ts.TypeFlags.Undefined) return { typeName: "Undefined" }
			},
		},

		StringLiteral: {
			priority: 10,
			create: (rawType: ts.Type) => {
				if (rawType.isStringLiteral())
					return {
						typeName: "StringLiteral",
						value: rawType.value,
					}
			},
		},

		TemplateLiteral: {
			priority: 10,
			create: (rawType: ts.Type) => {
				if (rawType.flags & ts.TypeFlags.TemplateLiteral) {
					const tsTemplateLiteral = rawType as ts.TemplateLiteralType
					const texts = tsTemplateLiteral.texts as Array<string>
					const types = tsTemplateLiteral.types.map(type =>
						type.flags & ts.TypeFlags.Number
							? "number"
							: type.flags & ts.TypeFlags.String
							? "string"
							: "bigint"
					)
					return { typeName: "TemplateLiteral", texts, types }
				}
			},
		},

		NumberLiteral: {
			priority: 10,
			create: (rawType: ts.Type) => {
				if (rawType.isNumberLiteral()) {
					return {
						typeName: "NumberLiteral",
						value: rawType.value,
					}
				}
			},
		},

		BigIntegerLiteral: {
			priority: 10,
			create: (rawType: ts.Type) => {
				if (rawType.flags & ts.TypeFlags.BigIntLiteral) {
					const literal = rawType as ts.LiteralType
					let value =
						typeof literal.value == "object"
							? (literal.value.negative ? "-" : "") + literal.value.base10Value
							: String(literal.value)
					return { typeName: "BigIntegerLiteral", value }
				}
			},
		},

		BooleanLiteral: {
			priority: 10,
			create: (rawType: ts.Type) => {
				if (rawType.flags & ts.TypeFlags.BooleanLiteral) {
					return {
						typeName: "BooleanLiteral",
						value: (rawType as any).intrinsicName == "true" ? true : false,
					}
				}
			},
		},

		// ---------------------- //
		// --    PRIMITIVES    -- //
		// ---------------------- //

		Any: {
			create: (rawType: ts.Type) => {
				if (rawType.flags & ts.TypeFlags.Any) return { typeName: "Any" }
			},
		},

		Boolean: {
			priority: 6, // before union (because a boolean is considered a true | false union),
			create: (rawType: ts.Type, node: ts.Node) => {
				if (
					rawType.flags & ts.TypeFlags.BooleanLike ||
					this.utilities.methodReturnTypeMatchesFlags(
						rawType,
						node,
						"valueOf",
						ts.TypeFlags.BooleanLike
					)
				) {
					return { typeName: "Boolean" }
				}
			},
		},

		Number: {
			create: (rawType: ts.Type) => {
				const features = [
					"toString",
					"toFixed",
					"toExponential",
					"toPrecision",
					"valueOf",
					"toLocaleString",
				]

				if (
					rawType.flags & ts.TypeFlags.NumberLike ||
					typeMatchFeatures(rawType, features)
				) {
					return { typeName: "Number" }
				}
			},
		},

		BigInteger: {
			create: (rawType: ts.Type, node: ts.Node) => {
				if (
					rawType.flags & ts.TypeFlags.BigIntLike ||
					this.utilities.methodReturnTypeMatchesFlags(
						rawType,
						node,
						"valueOf",
						ts.TypeFlags.BigIntLike
					)
				) {
					return { typeName: "BigInteger" }
				}
			},
		},

		String: {
			create: (rawType: ts.Type) => {
				const features = [
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

				if (
					rawType.flags & ts.TypeFlags.StringLike ||
					typeMatchFeatures(rawType, features)
				) {
					return { typeName: "String" }
				}
			},
		},

		RegularExpression: {
			create: (rawType: ts.Type) => {
				const features = [
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
				if (typeMatchFeatures(rawType, features)) return { typeName: "RegularExpression" }
			},
		},

		Date: {
			create: (rawType: ts.Type) => {
				const features = [
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

				if (typeMatchFeatures(rawType, features)) {
					return { typeName: "Date" }
				}
			},
		},

		ArrayBuffer: {
			create: (rawType: ts.Type, node: ts.Node) => {
				const features = ["slice", "byteLength"]
				if (
					typeMatchFeatures(rawType, features) &&
					this.utilities.getReturnTypeOfMethod(rawType, node, "slice")?.symbol
						.escapedName == "ArrayBuffer"
				) {
					return { typeName: "ArrayBuffer" }
				}
			},
		},

		// ----------------------- //
		// --    COMPOSABLES    -- //
		// ----------------------- //
		Object: {
			create: (rawType: ts.Type, node: ts.Node) => ({
				typeName: "Object",
				properties: this.createProperties(rawType, node),
			}),
		},

		Record: {
			priority: -1, // low priority,

			create: (rawType: ts.Type, node: ts.Node) => {
				const recordType = getRecordType(rawType)
				if (recordType) {
					const [keys, items] = this.createManyTypes(recordType, node)
					return { typeName: "Record", keys, items }
				}

				const mappedType = getMappedType(rawType)
				if (mappedType) {
					const [rawKeys, rawItems] = mappedType
					const items = this.createType(rawItems, node)
					let keys: Type

					if (rawKeys.length == 1) {
						keys = this.createType(rawKeys[0], node)
					} else {
						keys = <Types["Union"]>{
							typeName: "Union",
							items: this.createManyTypes(rawKeys, node),
						}
					}

					return {
						typeName: "Record",
						keys,
						items,
					}
				}
			},
		},

		Array: {
			priority: -10, // after tuple
			create: (rawType: ts.Type, node: ts.Node) => {
				const rawItems = this.utilities.getArrayType(rawType)
				if (rawItems)
					return {
						typeName: "Array",
						items: this.createType(rawItems, node),
					}
			},
		},

		Tuple: {
			create: (rawType: ts.Type, node: ts.Node) => {
				const rawItems = this.utilities.getTupleType(rawType)
				if (rawItems)
					return {
						typeName: "Tuple",
						items: this.createManyTypes(rawItems, node),
					}
			},
		},

		Map: {
			create: (rawType: ts.Type, node: ts.Node) => {
				const features = [
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

				if (
					rawType.symbol?.getEscapedName() == "Map" &&
					typeMatchFeatures(rawType, features)
				) {
					const [keys, items] = this.createManyTypes(
						this.checker.getTypeArguments(rawType as ts.TypeReference),
						node
					)
					return { typeName: "Map", keys, items }
				}
			},
		},

		Set: {
			create: (rawType: ts.Type, node: ts.Node) => {
				const features = [
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

				if (
					rawType.symbol?.getEscapedName() == "Set" &&
					typeMatchFeatures(rawType, features)
				) {
					const items = this.createType(
						this.checker.getTypeArguments(rawType as ts.TypeReference)[0],
						node
					)
					return { typeName: "Set", items }
				}
			},
		},

		Union: {
			priority: 5,
			create: (rawType: ts.Type, node: ts.Node) => {
				if (rawType.isUnion()) {
					return {
						typeName: "Union",
						items: this.createManyTypes(rawType.types, node),
					}
				}
			},
		},

		Enumeration: {
			create: (rawType: ts.Type, node: ts.Node) => {
				if (rawType.flags & ts.TypeFlags.EnumLike) {
					const items: Record<string, Type> = {}

					if (rawType.isUnion()) {
						rawType.types.forEach(tsProperty => {
							const name = String(tsProperty.symbol.escapedName)
							items[name] = this.createType(tsProperty, node)
						})
					} else {
						// enumeration of numbers that may not be constant
						rawType.symbol.exports?.forEach((tsSymbol, tsName) => {
							const name = String(tsName)
							const value = this.checker.getConstantValue(
								tsSymbol.valueDeclaration as ts.EnumMember
							)
							if (value === undefined) {
								items[name] = { typeName: "Number" }
							} else if (typeof value == "string") {
								items[name] = { typeName: "StringLiteral", value }
							} else {
								items[name] = { typeName: "NumberLiteral", value }
							}
						})
					}

					return { typeName: "Enumeration", items }
				}
			},
		},

		Function: {
			create: (rawType: ts.Type, node: ts.Node) => {
				const rawSignatures = rawType.getCallSignatures()
				if (rawSignatures?.length) {
					// console.log("Function type:", rawType)
					const signatures: Signature[] = rawSignatures.map(signature => {
						// signature
						// 	.getParameters()
						// 	.forEach(tsSymbol =>
						// 		console.log("Parameter type:", getTypeOfSymbol(tsSymbol, node))
						// 	)
						const parameters = signature
							.getParameters()
							.map(symbol =>
								this.createType(
									this.checker.getTypeOfSymbolAtLocation(symbol, node),
									node
								)
							)
						const returnType = this.createType(signature.getReturnType(), node)
						return { parameters, returnType }
					})

					return { typeName: "Function", signatures }
				}
			},
		},

		// /**
		//  * Class as value (not a type declaration, do not mix up with a class declaration)
		//  */
		Class: {
			create: (rawType: ts.Type, node: ts.Node) => {
				const rawSignatures = rawType.getConstructSignatures()

				if (rawSignatures?.length) {
					const signatures: Signature[] = rawSignatures.map(signature => {
						const parameters = signature
							.getParameters()
							.map(symbol =>
								this.createType(
									this.checker.getTypeOfSymbolAtLocation(symbol, node),
									node
								)
							)
						const returnType = this.createType(signature.getReturnType(), node)
						return { parameters, returnType }
					})

					const properties = this.createProperties(rawType, node)

					return { typeName: "Class", signatures, properties }
				}
			},
		},

		// ----------------------- //
		// --      SPECIALS     -- //
		// ----------------------- //
		Reference: {},
	}
}
