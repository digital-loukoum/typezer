import { Typezer } from "../Typezer"

export function parseSourceFiles(this: Typezer) {
	this.declarations = this.sourceFiles.map(this.parseSourceFile).flat()
}
