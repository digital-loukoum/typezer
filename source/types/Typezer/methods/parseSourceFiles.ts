import { Typezer } from "../Typezer.js"

export function parseSourceFiles(this: Typezer) {
	this.rawDeclarations = this.entrySourceFiles.map(this.parseSourceFile).flat()
}
