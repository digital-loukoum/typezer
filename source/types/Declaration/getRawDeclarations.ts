import ts from "typescript"
import { findChildNode, findLastChildNode } from "../../utilities/findChildNode"
import { getTypeChecker } from "../../utilities/typeChecker"
import { RawDeclaration } from "./RawDeclaration"

export function getRawDeclarations(sourceFile: ts.SourceFile): RawDeclaration[] {
	const result: Omit<RawDeclaration, "type">[] = []
	const { fileName } = sourceFile
	const exportAliases: [string, string][] = []

	sourceFile.forEachChild(node => {
		const isExported = !!findChildNode(
			node,
			ts.SyntaxKind.SyntaxList,
			ts.SyntaxKind.ExportKeyword
		)

		switch (node.kind) {
			case ts.SyntaxKind.ExportAssignment: {
				result.push({
					fileName,
					name: "default",
					exportedAs: ["default"],
					node,
				})
				break
			}

			case ts.SyntaxKind.ExportDeclaration: {
				const syntaxList = findChildNode(
					node,
					ts.SyntaxKind.NamedExports,
					ts.SyntaxKind.SyntaxList
				)!
				syntaxList.getChildren().forEach(child => {
					if (child.kind != ts.SyntaxKind.ExportSpecifier) return
					const exportedValue = findChildNode(child, ts.SyntaxKind.Identifier)!.getText()
					const exportedAs = findLastChildNode(child, ts.SyntaxKind.Identifier)!.getText()
					exportAliases.push([exportedValue, exportedAs])
				})
				break
			}

			case ts.SyntaxKind.VariableStatement: {
				const syntaxList = findChildNode(
					node,
					ts.SyntaxKind.VariableDeclarationList,
					ts.SyntaxKind.SyntaxList
				)!
				syntaxList
					.getChildren()
					.filter(({ kind }) => kind == ts.SyntaxKind.VariableDeclaration)
					.forEach(node => {
						const name = findChildNode(node, ts.SyntaxKind.Identifier)!.getText()
						result.push({
							fileName,
							name,
							exportedAs: isExported ? [name] : [],
							node,
						})
					})
				break
			}

			case ts.SyntaxKind.FunctionDeclaration:
			case ts.SyntaxKind.ClassDeclaration:
			case ts.SyntaxKind.TypeAliasDeclaration:
			case ts.SyntaxKind.EnumDeclaration:
			case ts.SyntaxKind.InterfaceDeclaration: {
				const name = findChildNode(node, ts.SyntaxKind.Identifier)!.getText()
				result.push({
					fileName,
					name,
					exportedAs: isExported ? [name] : [],
					node,
				})
			}
		}
	})

	// every value that has been exported in an export {...} statement is marked as exported
	for (const [exportedValue, exportedAs] of exportAliases) {
		const declaration = result.find(({ name }) => name == exportedValue)
		if (declaration && !declaration.exportedAs.includes(exportedAs)) {
			declaration.exportedAs.push(exportedAs)
		}
	}

	return result.map(declaration => ({
		...declaration,
		type: getTypeChecker().getTypeAtLocation(declaration.node),
	}))
}
