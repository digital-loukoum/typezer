import { forEachChild, SyntaxKind } from "./typescript"
import type { Node } from "./typescript"
import type { Visitor } from "./Visitor"

export function visit(node: Node, visitor: Visitor) {
	const kind = SyntaxKind[node.kind] as keyof typeof SyntaxKind
	return visitor[kind]?.(node)
}

export function visitRecursively(node: Node, visitor: Visitor) {
	if (visit(node, visitor) !== false) visitChildrenRecursively(node, visitor)
}
export function visitChildren(node: Node, visitor: Visitor) {
	forEachChild(node, node => visit(node, visitor))
}

export function visitChildrenRecursively(node: Node, visitor: Visitor) {
	forEachChild(node, node => visit(node, visitor))
}
