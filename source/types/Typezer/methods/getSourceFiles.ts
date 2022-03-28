import { Typezer } from "../Typezer"

export function getSourceFiles(this: Typezer) {
	this.sourceFiles = this.program.getSourceFiles()

	// we find our local source files
	this.localSourceFiles = this.sourceFiles.filter(
		tsSourceFile => !tsSourceFile.fileName.includes("node_modules")
	)

	this.entrySourceFiles = this.localSourceFiles.filter(({ fileName }) =>
		this.files.includes(fileName)
	)

	this.sourceFiles = this.entrySourceFiles
}
