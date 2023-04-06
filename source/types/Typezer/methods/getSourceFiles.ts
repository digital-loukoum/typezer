import { normalizePath } from "../../../utilities/normalizePath.js"
import { Typezer } from "../Typezer.js"

export function getSourceFiles(this: Typezer) {
	const normalizedFiles = this.files.map(normalizePath)

	this.sourceFiles = this.program.getSourceFiles()

	// we find our local source files
	this.localSourceFiles = this.sourceFiles.filter(
		({ fileName }) => !fileName.includes("node_modules")
	)

	this.entrySourceFiles = this.localSourceFiles.filter(({ fileName }) => {
		return normalizedFiles.includes(fileName)
	})
}
