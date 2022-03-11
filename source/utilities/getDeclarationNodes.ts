import ts from "typescript"
import { findChildNode } from "./findChildNode"

/**
 * Return all declaration nodes from a given node.
 * A declaration node is a node that exports one or more types or values.
 */
export function getDeclarationNodes(node: ts.Node): {
	isExported: boolean
	nodes: ts.Node[]
} {
	let isExported = false
	let nodes: ts.Node[]

	switch (node.kind) {
		case ts.SyntaxKind.ExportAssignment: {
			nodes = [node]
			break
		}

		case ts.SyntaxKind.ExportDeclaration: {
			const syntaxList = findChildNode(
				node,
				ts.SyntaxKind.NamedExports,
				ts.SyntaxKind.SyntaxList
			)!
			nodes = syntaxList
				.getChildren()
				.filter(child => child.kind == ts.SyntaxKind.ExportSpecifier)
			break
		}

		case ts.SyntaxKind.VariableStatement: {
			const mainSyntaxList = findChildNode(node, ts.SyntaxKind.SyntaxList)!
			const isExported = findChildNode(mainSyntaxList, ts.SyntaxKind.ExportKeyword)
			const syntaxList = findChildNode(
				node,
				ts.SyntaxKind.VariableDeclarationList,
				ts.SyntaxKind.SyntaxList
			)!
			nodes = syntaxList
				.getChildren()
				.filter(child => child.kind == ts.SyntaxKind.VariableDeclaration)
			break
		}

		case ts.SyntaxKind.FunctionDeclaration:
		case ts.SyntaxKind.ClassDeclaration:
		case ts.SyntaxKind.TypeAliasDeclaration:
		case ts.SyntaxKind.EnumDeclaration:
		case ts.SyntaxKind.InterfaceDeclaration: {
			const isExported = findChildNode(
				node,
				ts.SyntaxKind.SyntaxList,
				ts.SyntaxKind.ExportKeyword
			)
			nodes = [node]
		}

		default:
			nodes = []
	}

	return { isExported, nodes }
}
