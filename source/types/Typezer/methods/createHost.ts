import ts from "typescript"
import { Typezer } from "../Typezer.js"

export function createHost(this: Typezer) {
	const host = ts.createCompilerHost(this.compilerOptions)
	const { getSourceFile } = host
	host.getSourceFile = (fileName: string, languageVersion: ts.ScriptTarget) => {
		let sourceFile = this.sourceFileCache.get(fileName)
		if (!sourceFile) {
			this.sourceFileCache.set(
				fileName,
				(sourceFile = getSourceFile(fileName, languageVersion))
			)
		}
		return sourceFile
	}
	return host
}
