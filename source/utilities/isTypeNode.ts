import ts from "typescript"

export function isTypeNode(node: ts.Node): boolean {
	return [
		ts.SyntaxKind.TypeAliasDeclaration,
		ts.SyntaxKind.ClassDeclaration,
		ts.SyntaxKind.InterfaceDeclaration,
		ts.SyntaxKind.EnumDeclaration,
	].includes(node.kind)
}
