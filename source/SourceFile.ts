import ts from "typescript"
import { Properties } from "./Property"
import { Type } from "./Type"
import {
	ClassDeclaration,
	createTypeDeclaration,
	TypeAliasDeclaration,
	TypeDeclaration,
} from "./TypeDeclaration"
import { getExportedTypeNodeName } from "./utilities"

export class SourceFile {
	constructor(public sourceFile: ts.SourceFile) {}

	get name(): string {
		return this.sourceFile.fileName
	}

	getTypeDeclarations(
		parent: ts.Node = this.sourceFile,
		exportedNodes: Record<string, TypeDeclaration> = {}
	): typeof exportedNodes {
		parent.forEachChild(node => {
			// export default...
			// if (node.kind == ts.SyntaxKind.ExportAssignment) {
			// 	node.forEachnode(node => {
			// 		exportedNodes["default"] = node
			// 	})
			// }

			const name = getExportedTypeNodeName(node)
			if (name) {
				exportedNodes[name] = createTypeDeclaration(node)
			}
		})

		return exportedNodes
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
