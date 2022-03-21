import { Typezer } from "../Typezer"

export function parseSourceFiles(this: Typezer) {
	this.rawDeclarations = this.sourceFiles.map(this.parseSourceFile).flat()
}
