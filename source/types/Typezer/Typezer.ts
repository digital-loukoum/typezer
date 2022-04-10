import ts from "typescript"
import glob from "fast-glob"
import { FSWatcher } from "chokidar"
import { print } from "@digitak/print"
import { resolve } from "path"
import micromatch from "micromatch"
import { parseSourceFiles } from "./methods/parseSourceFiles.js"
import { getSourceFiles } from "./methods/getSourceFiles.js"
import { startProgram } from "./methods/startProgram.js"
import { updateWatchedFiles } from "./methods/updateWatchedFiles.js"
import { createHost } from "./methods/createHost.js"
import { watch } from "./methods/watch.js"
import { parseSourceFile } from "./methods/parseSourceFile.js"
import { RawDeclaration } from "../Declaration/RawDeclaration.js"
import { createRawDeclaration } from "./methods/createRawDeclaration.js"
import { createType } from "./methods/createType.js"
import { createManyTypes } from "./methods/createManyTypes.js"
import { creators } from "../Type/creators.js"
import { createProperties } from "./methods/createProperties.js"
import { utilities } from "./methods/utilities.js"
import { getRawDeclarationType } from "./methods/getRawDeclarationType.js"
import { getRawDeclarationTypes } from "./methods/getRawDeclarationTypes.js"
import { refineRawDeclaration } from "./methods/refineRawDeclaration.js"
import { Declaration } from "../Declaration/Declaration.js"
import { createSchema } from "./methods/createSchema.js"
import { Schema } from "../Schema/Schema.js"
import { Scope } from "../Scope/Scope.js"

export type TypezerOptions = {
	files?: string[]
	symbols?: string[] // list of target symbols
	compilerOptions?: ts.CompilerOptions
}

export class Typezer {
	public readonly compilerOptions: ts.CompilerOptions

	public files: Array<string>
	public readonly symbols?: string[]
	public readonly matchRootSymbol: (value: string) => boolean
	public sourceFiles: readonly ts.SourceFile[] = []
	public localSourceFiles: readonly ts.SourceFile[] = []
	public entrySourceFiles: readonly ts.SourceFile[] = []
	public schema: Schema = {}
	public declarations: Declaration[] = []
	public rawDeclarations: RawDeclaration[] = []

	protected scope: Scope = []

	protected checker: ts.TypeChecker
	protected program: ts.Program
	protected watcher?: FSWatcher
	protected host: ts.CompilerHost
	protected sourceFileCache = new Map<string, ts.SourceFile | undefined>()

	constructor({ files = [], symbols, compilerOptions = {} }: TypezerOptions) {
		this.symbols = symbols

		if (!this.symbols) this.matchRootSymbol = () => true
		else {
			const matchers = this.symbols.map(symbol => micromatch.matcher(symbol))
			this.matchRootSymbol = (value: string) => matchers.some(matcher => matcher(value))
		}

		this.files = files
			.map(file => glob.sync(file))
			.flat()
			.map(file => resolve(file))

		if (!this.files.length) {
			print`[yellow:No files found matching ${JSON.stringify(files)}]`
		}

		this.compilerOptions = {
			skipDefaultLibCheck: true,
			noEmit: true,
			...compilerOptions,
		}

		this.host = this.createHost()
		this.program = this.startProgram()
		this.checker = this.program.getTypeChecker()
	}

	public watch = watch.bind(this)

	protected utilities = utilities.call(this)
	protected creators = creators.call(this)

	protected startProgram = startProgram.bind(this)
	protected getSourceFiles = getSourceFiles.bind(this)
	protected parseSourceFile = parseSourceFile.bind(this)
	protected parseSourceFiles = parseSourceFiles.bind(this)

	protected createHost = createHost.bind(this)
	protected updateWatchedFiles = updateWatchedFiles.bind(this)

	protected createRawDeclaration = createRawDeclaration.bind(this)
	protected createType = createType.bind(this)
	protected createManyTypes = createManyTypes.bind(this)
	protected getRawDeclarationType = getRawDeclarationType.bind(this)
	protected getRawDeclarationTypes = getRawDeclarationTypes.bind(this)
	protected refineRawDeclaration = refineRawDeclaration.bind(this)
	protected createProperties = createProperties.bind(this)
	protected createSchema = createSchema.bind(this)
}
