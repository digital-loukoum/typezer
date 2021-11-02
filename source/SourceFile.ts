import ts from "typescript"
import { Properties } from "./Property"
import { Type } from "./Type"

export class SourceFile {
	constructor(public sourceFile: ts.SourceFile) {}

	get name(): string {
		return this.sourceFile.fileName
	}

	getExportedNodes(
		parent: ts.Node = this.sourceFile,
		exportedNodes: Record<string, ts.Node> = {}
	): typeof exportedNodes {
		let visitingExportNode = false

		parent.forEachChild(child => {
			// export default...
			if (child.kind == ts.SyntaxKind.ExportAssignment) {
				child.forEachChild(node => {
					exportedNodes["default"] = node
				})
			}

			// export [const | let | var | class | type | interface] ...
			// next node is the declaration...
			if (child.kind == ts.SyntaxKind.ExportKeyword) {
				visitingExportNode = true
				return
			}
			// ...the declaration
			if (visitingExportNode) {
				// export type (class, type, interface)
				if (child.kind == ts.SyntaxKind.Identifier) exportedNodes[child.getText()] = child
				// export value or class
				else if (child.kind == ts.SyntaxKind.VariableDeclarationList) {
					child.forEachChild(node => {
						exportedNodes[node.getChildren()[0].getText()] = node
					})
				}
			} else this.getExportedNodes(child, exportedNodes)

			visitingExportNode = false
		})

		return exportedNodes
	}

	getExportedValueTypes(): Record<string, Type> {
		return Object.fromEntries(
			Object.entries(this.getExportedNodes()).map(([key, node]) => [
				key,
				Type.fromNode(node),
			])
		)
	}

	// getTypeDeclarations(): Type[] {
	// 	const statements = this.sourceFile.statements.filter(
	// 		statement =>
	// 			ts.isTypeAliasDeclaration(statement) ||
	// 			ts.isClassDeclaration(statement) ||
	// 			ts.isInterfaceDeclaration(statement)
	// 	)
	// 	return statements.map(statement => new Type(this.typeChecker, statement))
	// }

	// getExportedValues(): Properties {
	// 	const exportedValues: Properties = {}
	// 	this.getExportedValuesSymbols().forEach(exportedSymbol => {
	// 		const [declaration] = exportedSymbol.getDeclarations() || []
	// 		if (!declaration) return // should never happen
	// 		const expression = this.getExportDeclarationExpression(declaration)
	// 		const type = Type.fromNode(this.typeChecker, expression)
	// 		exportedValues[exportedSymbol.name] = type.toProperty()
	// 	})
	// 	return exportedValues
	// }

	// private getExportedSymbols(): ts.Symbol[] {
	// 	const moduleSymbol = this.typeChecker.getSymbolAtLocation(this.sourceFile)
	// 	if (!moduleSymbol) return []
	// 	const exportedSymbols = this.typeChecker.getExportsOfModule(moduleSymbol)
	// 	return exportedSymbols
	// }

	// private getExportedValuesSymbols(): ts.Symbol[] {
	// 	return this.getExportedSymbols().filter(symbol => {
	// 		const [declaration] = symbol.getDeclarations() || []
	// 		if (!declaration) return false // should never happen
	// 		const declaredType = this.typeChecker.getDeclaredTypeOfSymbol(symbol)

	// 		// if the exported value is a type we dismiss it
	// 		if (declaredType.flags & ts.TypeFlags.Object) return false

	// 		const expression = this.getExportDeclarationExpression(declaration)

	// 		// if the exported value is a function we dismiss it
	// 		const type = this.typeChecker.getTypeOfSymbolAtLocation(symbol, expression)
	// 		const typeSymbol = type.getSymbol()
	// 		if (typeSymbol && typeSymbol.flags & ts.SymbolFlags.Function) return false

	// 		// it is a valid value
	// 		return true
	// 	})
	// }

	// private getExportDeclarationExpression(declaration: ts.Declaration): ts.Node {
	// 	return ts.isExportAssignment(declaration)
	// 		? declaration.expression // default export
	// 		: declaration // other named exports
	// }
}
