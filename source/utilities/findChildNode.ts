import ts from "typescript"

export function findChildNode(
	tsNode: ts.Node,
	...children: Array<ts.SyntaxKind>
): ts.Node | undefined {
	if (!children.length) return undefined
	const childKind = children.shift()
	const child = tsNode.getChildren().find(child => child.kind == childKind)
	if (child) return children.length ? findChildNode(child, ...children) : child
}

export function findLastChildNode(
	tsNode: ts.Node,
	...children: Array<ts.SyntaxKind>
): ts.Node | undefined {
	if (!children.length) return undefined
	const childKind = children.shift()
	const child = tsNode
		.getChildren()
		.reverse()
		.find(child => child.kind == childKind)
	if (child) return children.length ? findLastChildNode(child, ...children) : child
}
