import type { Visitor } from "../Visitor"
import { visitRecursively } from "../visit"
import { Node, SyntaxKind } from "../typescript"
import type { TypeAliasDeclaration, Identifier, ComputedPropertyName } from "typescript"

export default class TypeSniffer {
	constructor(private root: Node, private types: Record<string, any> = {}) {}

	sniff() {
		visitRecursively(this.root, this.visitor)
		return this.types
	}

	// extract the synthetic informations of a type
	// (we use 'any' here because Typescript types are not true -.-)
	extractType(node: any) {
		switch (node.kind) {
			case SyntaxKind.TypeLiteral: {
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
				return node.getText()
			case SyntaxKind.UnionType:
				throw new SyntaxError(`Union types are not authorized: ${node.getText()}`)

			default:
				console.log("Unknown type", SyntaxKind[node.kind])
				return null
		}
	}

	extractName(node: any): string {
		switch (node.kind) {
			case SyntaxKind.Identifier:
				return node.getText()
			case SyntaxKind.ComputedPropertyName:
				if (node.expression.kind == SyntaxKind.StringLiteral)
					return node.expression.getText()
				else throw new SyntaxError(`Non-constant property names are forbidden`)
			default:
				throw new Error(`Cannot find name of node ${SyntaxKind[node.kind]}`)
		}
	}

	private visitor: Visitor = {
		TypeAliasDeclaration: (node: TypeAliasDeclaration) => {
			this.types[node.name.escapedText as string] = this.extractType(node.type)
			return false
		},
	}
}
