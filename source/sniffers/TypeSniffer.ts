import type { Visitor } from "../Visitor"
import { visitRecursively } from "../visit"
import { Node, SyntaxKind } from "../typescript"
import type { TypeAliasDeclaration } from "typescript"

export default class TypeSniffer {
	constructor(private root: Node, private types: Record<string, any> = {}) {}

	sniff() {
		visitRecursively(this.root, this.visitor)
		return this.types
	}

	// extract the synthetic informations of a type
	extractType(node: TypeAliasDeclaration) {
		switch (node.type.kind) {
			case SyntaxKind.TypeLiteral:
				// @ts-ignore
				console.log(node.type.members)
				return {}
			default:
				console.log("?")
				return {}
		}
	}

	private visitor: Visitor = {
		TypeAliasDeclaration: (node: TypeAliasDeclaration) => {
			this.types[node.name.escapedText as string] = this.extractType(node)
		},
	}
}
