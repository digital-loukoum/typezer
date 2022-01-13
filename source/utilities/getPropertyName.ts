import ts from "typescript"

export function getPropertyName(node: ts.Node): string {
	let name = ""
	node.forEachChild(child => {
		if (child.kind == ts.SyntaxKind.Identifier) name = child.getText()
	})
	return name
}
