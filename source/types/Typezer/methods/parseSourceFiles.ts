import { Typezer } from "../Typezer"

export function parseSourceFiles(this: Typezer) {
	this.rawDeclarations = this.entrySourceFiles.map(this.parseSourceFile).flat()
}
