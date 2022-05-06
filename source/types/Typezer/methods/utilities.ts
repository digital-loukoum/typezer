import ts from "typescript"
import { Signature } from "../../Signature/Signature.js"
import { Type } from "../../Type/Type.js"
import { Typezer } from "../Typezer.js"

export function utilities(this: Typezer) {
	return {
		isArrayType: (rawType: ts.Type): boolean => {
			// @ts-ignore
			return this.checker.isArrayType(rawType)
		},

		getArrayType: (rawType: ts.Type): ts.Type | undefined => {
			if (this.utilities.isArrayType(rawType)) {
				return this.checker.getTypeArguments(rawType as ts.TypeReference)[0]
			}
		},

		isTupleType: (type: ts.Type): boolean => {
			// @ts-ignore
			return this.checker.isTupleType(type)
		},

		getTupleType: (type: ts.Type): readonly ts.Type[] | undefined => {
			if (this.utilities.isTupleType(type)) {
				return this.checker.getTypeArguments(type as ts.TypeReference)
			}
		},

		getReturnTypeOfMethod: (
			type: ts.Type,
			node: ts.Node,
			methodName: string
		): ts.Type | undefined => {
			const properties = type.getProperties()
			const method = properties.find(({ escapedName }) => escapedName == methodName)
			if (!method) return
			const methodType = this.checker.getTypeOfSymbolAtLocation(method, node)
			const [signature] = methodType.getCallSignatures()
			if (!signature) return
			return signature.getReturnType()
		},

		methodReturnTypeMatchesFlags: (
			type: ts.Type,
			node: ts.Node,
			methodName: string,
			flags: ts.TypeFlags
		): boolean => {
			const returnType = this.utilities.getReturnTypeOfMethod(type, node, methodName)
			return !!(returnType && returnType.flags & flags)
		},

		getTypeGenerics: (rawType: ts.Type): readonly ts.Type[] | undefined => {
			return (rawType as any).types
		},

		getTypeArguments: (rawType: ts.Type): readonly ts.Type[] | undefined => {
			return rawType.aliasTypeArguments
		},

		getFunctionGenerics: (rawType: ts.Type): ts.Type[] | undefined => {
			const typeParameters = (
				rawType.symbol?.valueDeclaration as ts.SignatureDeclarationBase | undefined
			)?.typeParameters
			if (!typeParameters) return
			return typeParameters.map(node => this.checker.getTypeAtLocation(node))
		},

		getRawGenerics: (rawType: ts.Type): Record<string, ts.Type> => {
			return {} // generics are too complicated to deal with right now

			// const node =
			// 	rawType.symbol?.valueDeclaration ??
			// 	rawType.aliasSymbol?.valueDeclaration ??
			// 	rawType.aliasSymbol?.declarations?.[0] ??
			// 	rawType.symbol?.declarations?.[0]

			// if (!node) return {}
			// const rawGenerics: Record<string, ts.Type> = {}

			// node.forEachChild(child => {
			// 	if (child.kind == ts.SyntaxKind.TypeParameter) {
			// 		const typeParameter = child as ts.TypeParameterDeclaration
			// 		const type = this.checker.getTypeAtLocation(typeParameter)
			// 		rawGenerics[typeParameter.name.getText()] = type
			// 	}
			// })

			// return rawGenerics
		},

		getPromiseType: (rawType: ts.Type, node: ts.Node): ts.Type | undefined => {
			if (!["Promise", "PromiseLike"].includes(String(rawType.symbol?.escapedName))) {
				return
			}
			const thenSymbol = rawType.getProperty("then")
			if (!thenSymbol) return
			const thenType = this.checker.getTypeOfSymbolAtLocation(thenSymbol, node)
			if (!thenType) return

			if (rawType.symbol.escapedName == "PromiseLike") {
				return (thenType as any).mapper?.target
			} else {
				const [signature] = thenType.getCallSignatures()
				return (signature?.typeParameters?.[1] as any)?.mapper?.mapper2?.targets?.[0]
			}
		},

		getSignatures: (
			node: ts.Node,
			rawSignatures: readonly ts.Signature[]
		): Signature[] => {
			return rawSignatures.map(signature => {
				let restParameters: undefined | Type = undefined
				const parameters: Type[] = []
				const rawParameters = signature.getParameters()
				const minimumParameters = (signature as any).minArgumentCount

				rawParameters.forEach((symbol, index) => {
					const declaration = symbol.valueDeclaration as ts.ParameterDeclaration
					const isOptional = !!declaration.questionToken

					let type = this.createType(
						this.checker.getTypeOfSymbolAtLocation(symbol, node),
						node
					)

					if (isOptional) {
						type = {
							typeName: "Union",
							items: [type, { typeName: "Undefined" }],
						}
					}

					if (
						index == rawParameters.length - 1 &&
						type.typeName == "Array" &&
						(symbol.valueDeclaration as ts.ParameterDeclaration)?.dotDotDotToken
					) {
						restParameters = type.items
					} else {
						parameters.push(type)
					}
				})

				const returnType = this.createType(signature.getReturnType(), node)
				return {
					minimumParameters,
					parameters,
					...(restParameters ? { restParameters } : {}),
					returnType,
				}
			})
		},
	}
}
