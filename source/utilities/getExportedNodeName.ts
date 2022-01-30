import ts from "typescript"

export function getExportedNodeName(node: ts.Node): string | false {
	if (node.kind == ts.SyntaxKind.ExportAssignment) return "default"
	let isExported = false
	let name = ""

	node.forEachChild(child => {
		if (child.kind == ts.SyntaxKind.ExportKeyword) isExported = true
		else if (child.kind == ts.SyntaxKind.Identifier) name = child.getText()
	})

	return isExported && name
}
