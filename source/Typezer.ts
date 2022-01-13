import ts from "typescript"
import { createSourceFile } from "./types/SourceFile/createSourceFile"
import { SourceFile } from "./types/SourceFile/SourceFile"
import { setTypeChecker } from "./utilities/typeChecker"

export class Typezer {
	public tsProgram: ts.Program
	public sourceFiles: readonly SourceFile[]

	constructor(...files: string[]) {
		this.tsProgram = ts.createProgram(files, {
			skipDefaultLibCheck: true,
		})
		setTypeChecker(this.tsProgram.getTypeChecker())
		this.sourceFiles = this.tsProgram
			.getSourceFiles()
			.filter(tsSourceFile => !tsSourceFile.fileName.includes("node_modules"))
			.map(tsSourceFile => createSourceFile(tsSourceFile))
	}
}
