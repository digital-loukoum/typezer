import ts from "typescript"

export function isTypeNode(node: ts.Node): boolean {
	return [
		ts.SyntaxKind.TypeAliasDeclaration,
		ts.SyntaxKind.ClassDeclaration,
		ts.SyntaxKind.InterfaceDeclaration,
		ts.SyntaxKind.EnumDeclaration,
	].includes(node.kind)
}

export function getExportedTypeNodeName(node: ts.Node): string | false {
	if (!isTypeNode) return false
	let isExported = false
	let name = ""
	node.forEachChild(child => {
		if (child.kind == ts.SyntaxKind.ExportKeyword) isExported = true
		else if (child.kind == ts.SyntaxKind.Identifier) name = child.getText()
	})
	return isExported && name
}

export function getPropertyName(node: ts.Node): string {
	let name = ""
	node.forEachChild(child => {
		if (child.kind == ts.SyntaxKind.Identifier) name = child.getText()
	})
	return name
}
