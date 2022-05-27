import ts from "typescript"
import { getMappedType } from "../../utilities/getMappedType.js"
import { getRecordType } from "../../utilities/getRecordType.js"
import { getTypeId } from "../../utilities/getTypeId.js"
import { getTypeTarget } from "../../utilities/getTypeTarget.js"
import { typeMatchFeatures } from "../../utilities/typeMatchFeatures.js"
import { createModifier } from "../Modifier/createModifier.js"
import { Properties } from "../Properties/Properties.js"
import { Constructor } from "../Signature/Constructor.js"
import { Typezer } from "../Typezer/Typezer.js"
import { Type } from "./Type.js"
import { TypeName } from "./TypeName.js"
import { Types } from "./Types.js"

export type Creator<T> = {
	priority?: number
	create?: (_: {
		node: ts.Node
		rawType: ts.Type
		typeParameters?: Type[]
	}) => T | undefined
}

export function creators(this: Typezer): {
	[Key in TypeName]: Creator<Types[Key]>
} {
	return {
		Reference: {}, // not concerned
		CircularReference: {}, // not concerned

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

		Unknown: {
			priority: -100,
			create: ({ rawType }) => {
				if (rawType.flags & ts.TypeFlags.Unknown) return { typeName: "Unknown" }
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

		Symbol: {
			create: ({ rawType, node }) => {
				if (rawType.flags & ts.TypeFlags.ESSymbolLike) {
					return { typeName: "Symbol" }
				}
				if (!typeMatchFeatures(rawType, ["toString", "valueOf"])) return
				const valueOf = this.utilities.getReturnTypeOfMethod(rawType, node, "valueOf")
				if ((valueOf as any)?.intrinsicName == "symbol") {
					return { typeName: "Symbol" }
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
		Unresolved: {
			priority: -100,
			create: ({ rawType }) => {
				if (
					rawType.flags & ts.TypeFlags.TypeParameter &&
					Object.keys(rawType.getProperties()).length == 0
				) {
					return {
						typeName: "Unresolved",
						uniqueId: getTypeId(rawType),
					}
				}
			},
		},

		Object: {
			create: ({ rawType, node }) => ({
				typeName: "Object",
				properties: this.createProperties(rawType, node),
			}),
		},
		Namespace: {
			create: ({ rawType, node }) => {
				const symbolFlags = rawType.symbol?.flags
				if (
					symbolFlags &&
					(symbolFlags & ts.SymbolFlags.NamespaceModule ||
						symbolFlags & ts.SymbolFlags.ValueModule)
				) {
					return {
						typeName: "Namespace",
						properties: this.createProperties(rawType, node),
					}
				}
			},
		},
		Promise: {
			create: ({ rawType, node }) => {
				const rawItem = this.utilities.getPromiseType(rawType, node)
				if (rawItem) {
					const item = this.createType(rawItem, node)
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
						const keys = this.createType(recordType[0], node)
						const items = this.createType(recordType[1], node)
						return { typeName: "Record", keys, items }
					}
				}

				const mappedType = getMappedType(rawType)
				if (mappedType) {
					const [rawKeys, rawItems] = mappedType
					const items = this.createType(rawItems, node)
					let keys: Type

					if (rawKeys.length == 1) {
						keys = this.createType(rawKeys[0], node)
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
						items: this.createType(rawItems, node),
					}
			},
		},

		Tuple: {
			create: ({ rawType, node }) => {
				const rawItems = this.utilities.getTupleType(rawType)
				if (rawItems)
					return {
						typeName: "Tuple",
						items: rawItems.map((rawType, index) => this.createType(rawType, node)),
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
					const keys = this.createType(rawKeys, node)
					const items = this.createType(rawItems, node)
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
						node
					)
					return { typeName: "Set", items }
				}
			},
		},

		Union: {
			priority: 5,
			create: ({ rawType, node }) => {
				if (!rawType.isUnion()) return
				const items = rawType.types.map(rawItem => this.createType(rawItem, node))
				return { typeName: "Union", items }
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
			create: ({ rawType, node }) => {
				const rawSignatures = rawType.getCallSignatures()
				if (!rawSignatures?.length) return
				return {
					typeName: "Function",
					signatures: this.utilities.getSignatures(node, rawSignatures),
				}
			},
		},

		Class: {
			create: ({ rawType, node }) => {
				// from a given constructor
				const rawSignatures = rawType.getConstructSignatures()
				if (rawSignatures?.length) {
					const signature: Constructor = this.utilities.getSignatures(
						node,
						rawSignatures
					)[0]
					const properties: Properties = (signature as any).returnType?.properties ?? {}
					delete (signature as any).returnType

					const staticProperties = this.createProperties(rawType, node)
					delete staticProperties.prototype

					return {
						typeName: "Class",
						staticProperties,
						properties,
						signature,
					}
				}

				// from a class declaration node
				const classDeclarationNode = rawType.symbol?.valueDeclaration
				if (classDeclarationNode?.kind == ts.SyntaxKind.ClassDeclaration) {
					// class declaration
					const staticProperties: Properties = {}
					let signature: Constructor | undefined = undefined

					for (const member of (classDeclarationNode as ts.ClassDeclaration).members) {
						if (/\s*constructor\s*\(/.test(member.getText())) {
							const parameterNodes = (member as any).parameters as ts.Node[]
							let minimumParameters = 0
							let restParameters: undefined | Type = undefined
							const parameters: Type[] = []

							parameterNodes?.forEach(parameterNode => {
								const type = this.createType(
									this.checker.getTypeAtLocation(parameterNode),
									parameterNode
								)

								if (type.typeName == "Array" && (parameterNode as any).dotDotDotToken) {
									restParameters = type.items
								} else {
									parameters.push(type)
									if (
										!(parameterNode as any).questionToken &&
										!(parameterNode as any).initializer
									) {
										minimumParameters++
									}
								}
							})

							signature = {
								minimumParameters,
								parameters,
								...(restParameters ? { restParameters } : {}),
							}
							continue
						}

						const isStatic = member.modifiers?.some(
							modifier => modifier.kind == ts.SyntaxKind.StaticKeyword
						)
						if (!isStatic) continue

						const memberType = this.checker.getTypeAtLocation(member)
						const memberSymbol = (member as any).symbol as ts.Symbol
						if (!memberSymbol) continue

						staticProperties[memberSymbol.name] = this.createType(memberType, member)

						if (memberSymbol.flags & ts.SymbolFlags.Optional) {
							staticProperties[memberSymbol.name].optional = true
						}

						member.modifiers?.forEach(modifier => {
							const modifiers = (staticProperties[memberSymbol.name].modifiers ??= [])
							modifiers.push(createModifier(modifier))
						})
					}

					return {
						typeName: "Class",
						staticProperties,
						properties: this.createProperties(rawType, node),
						...(signature ? { signature } : {}),
					}
				}
			},
		},
	}
}
