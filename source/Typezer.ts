import ts from "typescript"
import { definitions } from "./types/Definition/definitions"
import { createSourceFile } from "./types/SourceFile/createSourceFile"
import { SourceFile } from "./types/SourceFile/SourceFile"
import { Type } from "./types/Type/Type"
import { setTypeChecker } from "./utilities/typeChecker"

export class Typezer {
	public tsProgram: ts.Program
	public sourceFiles: readonly SourceFile[]
	public host: ts.CompilerHost
	public options: ts.CompilerOptions

	get definitions() {
		return definitions
	}

	private sourceFileCache = new Map<string, ts.SourceFile | undefined>()

	constructor(files: string[], options: ts.CompilerOptions = {}) {
		this.options = {
			skipDefaultLibCheck: true,
			noEmit: true,
			...options,
		}

		this.host = this.createHost()
		this.tsProgram = ts.createProgram(files, this.options, this.host)

		setTypeChecker(this.tsProgram.getTypeChecker())

		const tsSourceFiles = this.tsProgram.getSourceFiles()

		this.sourceFiles = tsSourceFiles
			.filter(tsSourceFile => !tsSourceFile.fileName.includes("node_modules"))
			.map(tsSourceFile => createSourceFile(tsSourceFile))
	}

	getType(exportedTypeName: string, files?: string[]): Type | undefined {}
	getAllTypes(files?: string[]): Type[] {
		return []
	}

	getValue(exportedValueName: string, files?: string[]): Type | undefined {}
	getAllValues(files?: string[]): Type[] {
		return []
	}

	getDeclaration(exportedName: string, files?: string[]): Type | undefined {}
	getAllDeclarations(files?: string[]): Type[] {
		return []
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
		const { getSourceFile } = this.host
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
