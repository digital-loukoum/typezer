import ts from "typescript"
import { getMappedType } from "../../utilities/getMappedType"
import { getRecordType } from "../../utilities/getRecordType"
import { getTypeTarget } from "../../utilities/getTypeTarget"
import { typeMatchFeatures } from "../../utilities/typeMatchFeatures"
import { createModifier } from "../Modifier/createModifier"
import { Properties } from "../Properties/Properties"
import { Signature } from "../Signature/Signature"
import { Typezer } from "../Typezer/Typezer"
import { Type } from "./Type"
import { TypeName } from "./TypeName"
import { Types } from "./Types"

export type TypeDescriptor<T> = {
	priority?: number
	create?: (_: {
		node: ts.Node
		rawType: ts.Type
		typeParameters?: Type[]
	}) => T | undefined
}

export function typeDescriptors(this: Typezer): {
	[Key in TypeName]: TypeDescriptor<Types[Key]>
} {
	return {
		Reference: {}, // not concerned

		// ---------------------- //
		// --     LITERALS     -- //
		// ---------------------- //
		Never: {
			create: ({ rawType }) => {
				if (rawType.flags & ts.TypeFlags.Never) return { typeName: "Never" }
			},
		},

		Void: {
			create: ({ rawType }) => {
				if (rawType.flags & ts.TypeFlags.Void) return { typeName: "Void" }
			},
		},

		Null: {
			create: ({ rawType }) => {
				if (rawType.flags & ts.TypeFlags.Null) return { typeName: "Null" }
			},
		},

		Undefined: {
			create: ({ rawType }) => {
				if (rawType.flags & ts.TypeFlags.Undefined) return { typeName: "Undefined" }
			},
		},

		StringLiteral: {
			priority: 10,
			create: ({ rawType }) => {
				if (rawType.isStringLiteral())
					return {
						typeName: "StringLiteral",
						value: rawType.value,
					}
			},
		},

		TemplateLiteral: {
			priority: 10,
			create: ({ rawType }) => {
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
			create: ({ rawType }) => {
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
			create: ({ rawType }) => {
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
			create: ({ rawType }) => {
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
			priority: -100,
			create: ({ rawType }) => {
				if (rawType.flags & ts.TypeFlags.Any) return { typeName: "Any" }
			},
		},

		Boolean: {
			priority: 6, // before union (because a boolean is considered a true | false union),
			create: ({ rawType, node }) => {
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
			create: ({ rawType }) => {
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
			create: ({ rawType, node }) => {
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
			create: ({ rawType }) => {
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
			create: ({ rawType }) => {
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
			create: ({ rawType }) => {
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
			create: ({ rawType, node }) => {
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
			create: ({ rawType, node }) => ({
				typeName: "Object",
				properties: this.createProperties(rawType, node),
			}),
		},
		Promise: {
			create: ({ rawType, node }) => {
				const rawItem = this.utilities.getPromiseType(rawType, node)
				if (rawItem) {
					const item = this.createType(rawItem, node, { kind: "item" })
					return {
						typeName: "Promise",
						item,
					}
				}
			},
		},

		Record: {
			priority: -10, // low priority (must be last before "Object")

			create: ({ rawType, node }) => {
				const target = getTypeTarget(rawType)
				if (
					target &&
					target.aliasSymbol?.escapedName == "Record" &&
					target.aliasTypeArguments?.length == 2
				) {
					const recordType = getRecordType(rawType)
					if (recordType) {
						const keys = this.createType(recordType[0], node, { kind: "keys" })
						const items = this.createType(recordType[1], node, { kind: "items" })
						return { typeName: "Record", keys, items }
					}
				}

				const mappedType = getMappedType(rawType)
				if (mappedType) {
					const [rawKeys, rawItems] = mappedType
					const items = this.createType(rawItems, node, { kind: "items" })
					let keys: Type

					if (rawKeys.length == 1) {
						keys = this.createType(rawKeys[0], node, { kind: "keys" })
					} else {
						keys = {
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
			priority: -5, // after tuple
			create: ({ rawType, node }) => {
				const rawItems = this.utilities.getArrayType(rawType)
				if (rawItems)
					return {
						typeName: "Array",
						items: this.createType(rawItems, node, { kind: "items" }),
					}
			},
		},

		Tuple: {
			create: ({ rawType, node }) => {
				const rawItems = this.utilities.getTupleType(rawType)
				if (rawItems)
					return {
						typeName: "Tuple",
						items: rawItems.map((rawType, index) =>
							this.createType(rawType, node, { kind: "tupleItem", index })
						),
					}
			},
		},

		Map: {
			create: ({ rawType, node }) => {
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
					const [rawKeys, rawItems] = this.checker.getTypeArguments(
						rawType as ts.TypeReference
					)
					const keys = this.createType(rawKeys, node, { kind: "keys" })
					const items = this.createType(rawItems, node, { kind: "items" })
					return { typeName: "Map", keys, items }
				}
			},
		},

		Set: {
			create: ({ rawType, node }) => {
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
						node,
						{ kind: "items" }
					)
					return { typeName: "Set", items }
				}
			},
		},

		Union: {
			priority: 5,
			create: ({ rawType, node }) => {
				if (rawType.isUnion()) {
					return {
						typeName: "Union",
						items: this.createManyTypes(rawType.types, node),
					}
				}
			},
		},

		Enumeration: {
			priority: 6, // before Union
			create: ({ rawType, node }) => {
				if (rawType.flags & ts.TypeFlags.EnumLike) {
					const items: Record<string, Type> = {}

					if (rawType.isUnion()) {
						rawType.types.forEach(tsProperty => {
							const name = String(tsProperty.symbol.escapedName)
							items[name] = this.createType(tsProperty, node, { kind: "property", name })
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
			create: ({ rawType, node }) => {
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
			create: ({ rawType, node }) => {
				if (
					node.kind == ts.SyntaxKind.ClassDeclaration &&
					rawType.symbol?.valueDeclaration == node
				) {
					// class declaration
					const properties: Properties = {}

					for (const member of (node as ts.ClassDeclaration).members) {
						const isStatic = member.modifiers?.some(
							modifier => modifier.kind & ts.SyntaxKind.StaticKeyword
						)
						if (!isStatic) continue

						const memberType = this.checker.getTypeAtLocation(member)
						const memberSymbol = (member as any).symbol as ts.Symbol
						if (!memberSymbol) continue

						properties[memberSymbol.name] = this.createType(memberType, member, {
							kind: "property",
							name: memberSymbol.name,
						})

						if (memberSymbol.flags & ts.SymbolFlags.Optional) {
							properties[memberSymbol.name].optional = true
						}

						member.modifiers?.forEach(modifier => {
							const modifiers = (properties[memberSymbol.name].modifiers ??= [])
							modifiers.push(createModifier(modifier))
						})
					}

					Object.assign(properties, this.createProperties(rawType, node))
					return { typeName: "Class", properties }
				} else {
					// class variable assignment
					const [signature] = rawType.getConstructSignatures() ?? []
					if (!signature) return

					/**
					 * We don't add constructor informations because I just can't figure
					 * out how to get it from the class declaration.
					 */
					// const constructorParameters = signature
					// 	.getParameters()
					// 	.filter(({ name }) => name != "prototype")
					// 	.map(symbol =>
					// 		this.createType(
					// 			this.checker.getTypeOfSymbolAtLocation(symbol, node),
					// 			node,
					// 			{ kind: "parameter", name: String(symbol.escapedName) }
					// 		)
					// 	)

					const properties = {
						...this.createProperties(signature.getReturnType(), node),
						...this.createProperties(rawType, node),
					}
					delete properties.prototype
					return { typeName: "Class", properties }
				}
			},
		},
	}
}
