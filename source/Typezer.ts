import ts from "typescript"
import { Declaration } from "./types/Declaration/Declaration"
import { resetDefinitions } from "./types/Definition/definitions"
import { createSourceFile } from "./types/SourceFile/createSourceFile"
import { SourceFile } from "./types/SourceFile/SourceFile"
import { Type } from "./types/Type/Type"
import { setTypeChecker } from "./utilities/typeChecker"
import glob from "fast-glob"
import { Definition } from "./types/Definition/Definition"

export class Typezer {
	public tsProgram: ts.Program
	public sourceFiles: readonly SourceFile[]
	public host: ts.CompilerHost
	public options: ts.CompilerOptions
	public definitions: Record<string, Definition> = {}

	private declarations: Declaration[]
	private sourceFileCache = new Map<string, ts.SourceFile | undefined>()

	constructor(files: string[], options: ts.CompilerOptions = {}) {
		files = files.map(file => glob.sync(file)).flat()
		this.options = {
			skipDefaultLibCheck: true,
			noEmit: true,
			...options,
		}

		this.host = this.createHost()
		this.tsProgram = ts.createProgram(files, this.options, this.host)
		this.definitions = resetDefinitions()

		setTypeChecker(this.tsProgram.getTypeChecker())

		const tsSourceFiles = this.tsProgram.getSourceFiles()

		// we find our local source files
		this.sourceFiles = tsSourceFiles
			.filter(tsSourceFile => !tsSourceFile.fileName.includes("node_modules"))
			.map(tsSourceFile => createSourceFile(tsSourceFile))

		// we discover all declarations
		this.declarations = []
		for (const file of this.sourceFiles) {
			this.declarations = this.declarations.concat(file.getDeclarations())
		}
	}

	getType(name: string): Type | undefined {
		return this.getDeclaration(name)?.value
	}
	getAllTypes(): Type[] {
		return this.getAllDeclarations().map(({ value }) => value)
	}

	// getValue(name: string): Type | undefined {}
	// getAllValues(): Type[] {
	// 	return []
	// }

	getDeclaration(name: string): Declaration | undefined {
		return this.declarations.find(declaration => declaration.name == name)
	}
	getAllDeclarations(): Declaration[] {
		return this.declarations
	}

	watchType(): this {
		return this
	}
	watchAllTypes(): this {
		return this
	}

	watchValue(): this {
		return this
	}
	watchAllValues(): this {
		return this
	}
	watchDeclaration(): this {
		return this
	}
	watchAllDeclarations(): this {
		return this
	}

	private createHost() {
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
}
