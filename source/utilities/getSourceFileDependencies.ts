import print from "@digitak/print"
import ts from "typescript"

/**
 * Return the recursive flatten dependencies of a given source file.
 */
export function getSourceFileDependencies(
	program: ts.Program,
	sourceFile: ts.SourceFile,
	result = new Set<ts.SourceFile>()
): typeof result {
	const dependencies = (sourceFile as any)
		.imports as ts.Token<ts.SyntaxKind.StringLiteral>[]

	dependencies.forEach(node => {
		const unresolvedDependency = node.getText()

		const resolvedDependency: string = (
			program as any
		).getResolvedModuleWithFailedLookupLocationsFromCache(
			unresolvedDependency,
			sourceFile.fileName
		).resolvedModule.resolvedFileName

		const dependency = program.getSourceFile(resolvedDependency)

		if (!dependency) {
			print`[yellow:Could not find source file for module '${resolvedDependency}']`
		} else if (!result.has(dependency)) {
			result.add(dependency)
			getSourceFileDependencies(program, dependency, result)
		}
	})
	return result
}
