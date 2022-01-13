import ts, { isTypeNode } from "typescript"

export function getExportedTypeNodeName(node: ts.Node): string | false {
	if (!isTypeNode(node)) return false
	let isExported = false
	let name = ""
	node.forEachChild(child => {
		if (child.kind == ts.SyntaxKind.ExportKeyword) isExported = true
		else if (child.kind == ts.SyntaxKind.Identifier) name = child.getText()
	})
	return isExported && name
}
