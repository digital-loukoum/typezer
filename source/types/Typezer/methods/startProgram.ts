import ts from "typescript"
import { Typezer } from "../Typezer.js"

export function startProgram(this: Typezer): ts.Program {
	this.program = ts.createProgram(this.files, this.compilerOptions, this.host)
	this.checker = this.program.getTypeChecker()

	this.rawDeclarations = []

	this.getSourceFiles()
	this.parseSourceFiles()
	this.getRawDeclarationTypes()
	this.declarations = this.rawDeclarations.map(this.refineRawDeclaration)
	this.schema = this.createSchema()

	return this.program
}
