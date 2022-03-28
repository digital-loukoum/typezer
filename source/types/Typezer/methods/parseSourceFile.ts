import ts from "typescript"
import { basename } from "../../../utilities/basename"
import { findChildNode, findLastChildNode } from "../../../utilities/findChildNode"
import { RawDeclaration } from "../../Declaration/RawDeclaration"
import { Typezer } from "../Typezer"

export function parseSourceFile(
	this: Typezer,
	sourceFile: ts.SourceFile
): RawDeclaration[] {
	// print`[bold.magenta: [ ${sourceFile.fileName} ]]`
	const result: RawDeclaration[] = []
	const { fileName } = sourceFile
	const exportAliases: [string, string][] = []

	sourceFile.forEachChild(node => {
		const syntaxList = findChildNode(node, ts.SyntaxKind.SyntaxList)
		const isExported = !!(
			syntaxList && findChildNode(syntaxList, ts.SyntaxKind.ExportKeyword)
		)
		const isDefaultExport = !!(
			isExported &&
			syntaxList &&
			findChildNode(syntaxList, ts.SyntaxKind.DefaultKeyword)
		)

		// utility functions for standard declarations (functions, classes, enums, ...)
		const declare = (declare: RawDeclaration["declare"], declarationNode = node) => {
			const name =
				findChildNode(declarationNode, ts.SyntaxKind.Identifier)?.getText() ??
				(isDefaultExport ? basename(fileName) : "")

			if (!this.matchRootSymbol(name)) return

			result.push(
				this.createRawDeclaration({
					fileName,
					name,
					declare,
					exportedAs: isExported ? [name] : [],
					node: declarationNode,
				})
			)
		}

		// find declaration nodes
		switch (node.kind) {
			case ts.SyntaxKind.ModuleDeclaration:
				declare("namespace")
				break
			case ts.SyntaxKind.FunctionDeclaration:
				declare("function")
				break
			case ts.SyntaxKind.ClassDeclaration:
				declare("class")
				break
			case ts.SyntaxKind.TypeAliasDeclaration:
				declare("type")
				break
			case ts.SyntaxKind.EnumDeclaration:
				declare("enumeration")
				break
			case ts.SyntaxKind.InterfaceDeclaration:
				declare("interface")
				break

			case ts.SyntaxKind.VariableStatement: {
				const syntaxList = findChildNode(
					node,
					ts.SyntaxKind.VariableDeclarationList,
					ts.SyntaxKind.SyntaxList
				)!
				syntaxList
					.getChildren()
					.filter(({ kind }) => kind == ts.SyntaxKind.VariableDeclaration)
					.forEach(child => declare("variable", child))
				break
			}

			case ts.SyntaxKind.ExportAssignment: {
				// export default ...
				const children = node.getChildren()
				const typeNode = children[children.length - 1]

				result.push(
					this.createRawDeclaration({
						fileName,
						name: basename(fileName),
						declare: "default",
						exportedAs: ["default"],
						node: typeNode,
					})
				)
				break
			}

			case ts.SyntaxKind.ExportDeclaration: {
				// export { ... }
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
		}
	})

	// every value that has been exported in an export {...} statement is marked as exported
	for (const [exportedValue, exportedAs] of exportAliases) {
		const declaration = result.find(({ name }) => name == exportedValue)
		if (declaration && !declaration.exportedAs.includes(exportedAs)) {
			declaration.exportedAs.push(exportedAs)
		}
	}

	return result
}
