import ts from "typescript"
import { SourceFile } from "./SourceFile"

export class Typezer {
	public program: ts.Program
	public readonly typeChecker: ts.TypeChecker
	public sourceFiles: readonly SourceFile[]

	constructor(...files: string[]) {
		this.program = ts.createProgram(files, {
			skipDefaultLibCheck: true,
		})
		this.typeChecker = this.program.getTypeChecker()
		this.sourceFiles = this.program
			.getSourceFiles()
			.filter(sourceFile => !sourceFile.fileName.includes("node_modules"))
			.map(sourceFile => new SourceFile(this.typeChecker, sourceFile))
	}
}
