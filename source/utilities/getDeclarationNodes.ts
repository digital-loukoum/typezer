import ts from "typescript"
import { findChildNode } from "./findChildNode"

/**
 * Return all declaration nodes from a given node.
 * A declaration node is a node that exports one or more types or values.
 */
export function getDeclarationNodes(node: ts.Node): Array<ts.Node> {
	switch (node.kind) {
		case ts.SyntaxKind.ExportAssignment: {
			return [node]
		}

		case ts.SyntaxKind.ExportDeclaration: {
			const syntaxList = findChildNode(
				node,
				ts.SyntaxKind.NamedExports,
				ts.SyntaxKind.SyntaxList
			)!
			return syntaxList
				.getChildren()
				.filter(child => child.kind == ts.SyntaxKind.ExportSpecifier)
		}

		case ts.SyntaxKind.VariableStatement: {
			const mainSyntaxList = findChildNode(node, ts.SyntaxKind.SyntaxList)!
			if (findChildNode(mainSyntaxList, ts.SyntaxKind.ExportKeyword)) {
				const syntaxList = findChildNode(
					node,
					ts.SyntaxKind.VariableDeclarationList,
					ts.SyntaxKind.SyntaxList
				)!
				return syntaxList
					.getChildren()
					.filter(child => child.kind == ts.SyntaxKind.VariableDeclaration)
			}
		}

		default: {
			if (findChildNode(node, ts.SyntaxKind.SyntaxList, ts.SyntaxKind.ExportKeyword)) {
				return [node]
			}
		}
	}

	return []
}
