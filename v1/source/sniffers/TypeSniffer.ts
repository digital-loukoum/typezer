import type { Visitor } from "../Visitor"
import { visitRecursively } from "../visit"
import typescript from "typescript"
import type {
	Node,
	TypeChecker,
	Program,
	TypeAliasDeclaration,
	Identifier,
	ComputedPropertyName,
	ClassDeclaration,
} from "typescript"

const { SyntaxKind } = typescript

export default class TypeSniffer {
	constructor(
		private program: Program,
		private root: Node,
		private types: Record<string, any> = {},
		private typeChecker = program.getTypeChecker()
	) {}

	sniff() {
		visitRecursively(this.root, this.visitor)
		return this.types
	}

	// extract the synthetic informations of a type
	// (we use 'any' here because Typescript types are not correct -.-)
	extractType(node: any) {
		switch (node.kind) {
			case SyntaxKind.TypeLiteral: {
				console.log("-- Type literal")
				const result: Record<string, any> = {}

				for (const member of node.members) {
					result[this.extractName(member.name)] = this.extractType(member.type)
				}

				return result
			}
			case SyntaxKind.NumberKeyword:
				return "Number"
			case SyntaxKind.StringKeyword:
				return "String"
			case SyntaxKind.BooleanKeyword:
				return "Boolean"
			case SyntaxKind.TypeReference:
				console.log("(", node.typeName.escapedText, ")")
				const type = this.typeChecker.getTypeAtLocation(node)
				// @ts-ignore
				delete type.checker
				// @ts-ignore
				// delete type.target.checker
				console.log("getTypeAtLocation", type.symbol)
				// console.log("getTypeFromTypeNode", this.typeChecker.getTypeFromTypeNode(node))
				// return this.typeChecker.getTypeOfSymbolAtLocation()
				// console.log(node)
				// console.log()
				return node.typeName.escapedText
			case SyntaxKind.UnionType:
				throw new SyntaxError(`Union types are not authorized: ${node.escapedText}`)

			default:
				console.log("Unknown type", SyntaxKind[node.kind])
				return null
		}
	}

	extractName(node: any): string {
		switch (node.kind) {
			case SyntaxKind.Identifier:
				return node.escapedText
			case SyntaxKind.ComputedPropertyName:
				if (node.expression.kind == SyntaxKind.StringLiteral) {
					return node.expression.escapedText
				} else throw new SyntaxError(`Non-constant property names are forbidden`)
			default:
				throw new Error(`Cannot find name of node ${SyntaxKind[node.kind]}`)
		}
	}

	private visitor: Visitor = {
		TypeAliasDeclaration: (node: TypeAliasDeclaration) => {
			const type = this.typeChecker.getTypeAtLocation(node)
			console.log(`[type] ${node.name?.escapedText}`)
			// console.log("getProperties()", type.getProperties())

			for (const property of type.getProperties()) {
				const propertyType = this.typeChecker.getTypeOfSymbolAtLocation(property, node);
				console.log("- Property(", "name:", property.name, ", type:", this.typeChecker.typeToString(propertyType), ")");
			}

			// const subtype = this.typeChecker.getTypeAtLocation(node.type)
			// console.log(`[subtype] ${node.name?.escapedText}`)
			// // console.log("getProperties()", subtype.getProperties())

			// for (const property of subtype.getProperties()) {
			// 	const propertyType = this.typeChecker.getTypeOfSymbolAtLocation(property, node.type);
			// 	console.log("- Property(", "name:", property.name, ", type:", this.typeChecker.typeToString(propertyType), ")");
				
			// }

			return false
		},
		ClassDeclaration: (node: ClassDeclaration) => {
			const type = this.typeChecker.getTypeAtLocation(node)
			console.log(`[class] ${node.name?.escapedText}`)

			for (const property of type.getProperties()) {
				const propertyType = this.typeChecker.getTypeOfSymbolAtLocation(property, node);
				console.log("- Property(", "name:", property.name, ", type:", this.typeChecker.typeToString(propertyType), ")");
			}
			
			// this.types[node.name?.escapedText as string] = this.extractType(node.type)
			return false
		},
	}
}
