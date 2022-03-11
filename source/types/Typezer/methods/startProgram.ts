import ts from "typescript"
import { Typezer } from "../Typezer"

export function startProgram(this: Typezer): ts.Program {
	this.program = ts.createProgram(this.files, this.options, this.host)
	this.checker = this.program.getTypeChecker()

	this.getSourceFiles()
	this.parseSourceFiles()

	return this.program
}
