import print from "@digitak/print"
import ts from "typescript"

type FileIncludeReasons = Map<
	string,
	Array<{
		kind: number
		file: string
	}>
>

/**
 * Return the list of all source files that depend on the given source file
 */
export function getDependentSourceFiles(
	program: ts.Program,
	sourceFile: ts.SourceFile,
	result = new Set<ts.SourceFile>(),
	includeReasons = (program as any).getFileIncludeReasons() as FileIncludeReasons
): typeof result {
	const fileName = sourceFile.fileName.toLowerCase()

	for (const [included, reasons] of includeReasons) {
		reasons.forEach(({ kind, file }) => {
			if (kind != 3) return
			if (included.toLowerCase() == fileName) {
				const dependent = program.getSourceFile(file)
				if (!dependent) {
					print`[yellow:Could not find source file for module '${file}']`
				} else if (!result.has(dependent)) {
					result.add(dependent)
					getDependentSourceFiles(program, dependent, result, includeReasons)
				}
			}
		})
	}

	return result
}
