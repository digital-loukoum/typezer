import ts from "typescript"
import { Typezer } from "../Typezer"

export function createHost(this: Typezer) {
	const host = ts.createCompilerHost(this.options)
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
