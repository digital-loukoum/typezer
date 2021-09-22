import ts, { symbolName } from "typescript"
import { TypeDeclaration, TypeDeclarationNode } from "./TypeDeclaration"
import print from "cute-print"

export class SourceFile {
	constructor(private typeChecker: ts.TypeChecker, public sourceFile: ts.SourceFile) {}

	get name(): string {
		return this.sourceFile.fileName
	}

	getTypeDeclarations(): TypeDeclaration[] {
		const statements = this.sourceFile.statements.filter(
			statement =>
				ts.isTypeAliasDeclaration(statement) ||
				ts.isClassDeclaration(statement) ||
				ts.isInterfaceDeclaration(statement)
		) as TypeDeclarationNode[]
		return statements.map(statement => new TypeDeclaration(this.typeChecker, statement))
	}

	getExportedSymbols(): ts.Symbol[] {
		const moduleSymbol = this.typeChecker.getSymbolAtLocation(this.sourceFile)
		if (!moduleSymbol) return []
		const exportedSymbols = this.typeChecker.getExportsOfModule(moduleSymbol)
		return exportedSymbols
	}

	getExportedValuesSymbols(): ts.Symbol[] {
		return this.getExportedSymbols().filter(symbol => {
			// print`[bold.magenta:- ${symbol.name}] [blue:${symbol.flags}]`
			const [declaration] = symbol.getDeclarations() || []
			if (!declaration) return false // should never happen
			const declaredType = this.typeChecker.getDeclaredTypeOfSymbol(symbol)

			// if the exported value is a type we dismiss it
			if (declaredType.flags & ts.TypeFlags.Object) return false

			let expression: ts.Node
			if (ts.isExportAssignment(declaration)) {
				expression = declaration.expression
			} else if (
				ts.isExportSpecifier(declaration) ||
				ts.isVariableDeclaration(declaration) ||
				ts.isFunctionDeclaration(declaration)
			) {
				expression = declaration
			} else {
				throw new Error(
					`Export node kind is unknown: '${ts.SyntaxKind[declaration.kind]}'`
				)
			}

			// if the exported value is a function we dismiss it
			const type = this.typeChecker.getTypeAtLocation(expression)
			const typeSymbol = type.getSymbol()
			if (typeSymbol && typeSymbol.flags & ts.SymbolFlags.Function) return false

			// it is a valid value
			return true
		})
	}
}
