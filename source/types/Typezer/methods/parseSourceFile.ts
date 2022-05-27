import ts from "typescript"
import { basename } from "../../../utilities/basename.js"
import { findChildNode, findLastChildNode } from "../../../utilities/findChildNode.js"
import { RawDeclaration } from "../../Declaration/RawDeclaration.js"
import { Typezer } from "../Typezer.js"

export function parseSourceFile(
	this: Typezer,
	sourceFile: ts.SourceFile
): RawDeclaration[] {
	// print`[bold.magenta: [ ${sourceFile.fileName} ]]`
	const result: RawDeclaration[] = []
	const { fileName } = sourceFile
	const exportAliases: {
		node: ts.Node
		name: string
		exportedAs: string
	}[] = []

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
					const identifierNode = findChildNode(child, ts.SyntaxKind.Identifier)!
					exportAliases.push({
						node: identifierNode,
						name: identifierNode.getText(),
						exportedAs: findLastChildNode(child, ts.SyntaxKind.Identifier)!.getText(),
					})
				})
				break
			}
		}
	})

	// every value that has been exported in an export {...} statement is marked as exported
	for (const alias of exportAliases) {
		const declaration = result.find(({ name }) => name == alias.name)
		if (declaration) {
			if (!declaration.exportedAs.includes(alias.exportedAs)) {
				declaration.exportedAs.push(alias.exportedAs)
			}
		} else {
			result.push(
				this.createRawDeclaration({
					fileName,
					name: alias.name,
					declare: "transited",
					exportedAs: [alias.exportedAs],
					node: alias.node,
				})
			)
		}
	}

	return result
}
