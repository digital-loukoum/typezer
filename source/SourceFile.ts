import ts from "typescript"
import { TypeDeclaration, TypeDeclarationNode } from "./TypeDeclaration"

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
			const [declaration] = symbol.getDeclarations() || []
			if (!declaration) return false // should never happen
			const declaredType = this.typeChecker.getDeclaredTypeOfSymbol(symbol)

			// if the exported value is a type we dismiss it
			if (declaredType.flags & ts.TypeFlags.Object) return false

			let expression = ts.isExportAssignment(declaration)
				? declaration.expression // default export
				: declaration // other named exports

			// if the exported value is a function we dismiss it
			const type = this.typeChecker.getTypeAtLocation(expression)
			const typeSymbol = type.getSymbol()
			if (typeSymbol && typeSymbol.flags & ts.SymbolFlags.Function) return false

			// it is a valid value
			return true
		})
	}
}
