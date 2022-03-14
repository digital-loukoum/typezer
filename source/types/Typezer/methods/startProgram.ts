import ts from "typescript"
import { Typezer } from "../Typezer"

export function startProgram(this: Typezer): ts.Program {
	this.program = ts.createProgram(this.files, this.options, this.host)
	this.checker = this.program.getTypeChecker()

	this.getSourceFiles()
	this.parseSourceFiles()
	console.log("ZJHLAIZJDBLAJZBLDOINE")
	this.getRawDeclarationTypes()
	console.log("LAIZUHDLAKJHZDBKJAHBZDKJHBK")
	this.declarations = this.rawDeclarations.map(this.refineRawDeclaration)
	this.schema = this.createSchema()

	return this.program
}
