import path from "path"
import ts from "typescript"

/**
 * Read the compilerOptions from a tsconfig.json file
 */
export function readConfigFileOptions(
	tsconfigFile: string | undefined
): ts.CompilerOptions {
	if (!tsconfigFile) return {}
	return ts.parseJsonConfigFileContent(
		ts.readConfigFile(tsconfigFile, ts.sys.readFile).config,
		ts.sys,
		path.dirname(tsconfigFile)
	).options
}
