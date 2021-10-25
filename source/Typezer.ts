import ts from "typescript"
import { SourceFile } from "./SourceFile"
import { setTypeChecker } from "./typeChecker"

export class Typezer {
	public program: ts.Program
	public sourceFiles: readonly SourceFile[]

	constructor(...files: string[]) {
		this.program = ts.createProgram(files, {
			skipDefaultLibCheck: true,
		})
		setTypeChecker(this.program.getTypeChecker())
		this.sourceFiles = this.program
			.getSourceFiles()
			.filter(sourceFile => !sourceFile.fileName.includes("node_modules"))
			.map(sourceFile => new SourceFile(sourceFile))
	}
}
