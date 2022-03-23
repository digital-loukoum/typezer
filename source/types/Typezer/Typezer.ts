import ts from "typescript"
import glob from "fast-glob"
import { FSWatcher } from "chokidar"
import { print } from "@digitak/print"
import { resolve } from "path"
import { parseSourceFiles } from "./methods/parseSourceFiles"
import { getSourceFiles } from "./methods/getSourceFiles"
import { startProgram } from "./methods/startProgram"
import { updateWatchedFiles } from "./methods/updateWatchedFiles"
import { createHost } from "./methods/createHost"
import { watch } from "./methods/watch"
import { parseSourceFile } from "./methods/parseSourceFile"
import { RawDeclaration } from "../Declaration/RawDeclaration"
import { createRawDeclaration } from "./methods/createRawDeclaration"
import { createType } from "./methods/createType"
import { createManyTypes } from "./methods/createManyTypes"
import { creators } from "../Type/creators"
import { createProperties } from "./methods/createProperties"
import { utilities } from "./methods/utilities"
import { getRawDeclarationType } from "./methods/getRawDeclarationType"
import { getRawDeclarationTypes } from "./methods/getRawDeclarationTypes"
import { refineRawDeclaration } from "./methods/refineRawDeclaration"
import { Declaration } from "../Declaration/Declaration"
import { Type } from "../Type/Type"
import { Path } from "../Path/Path"
import { createSchema } from "./methods/createSchema"
import { Schema } from "../Schema/Schema"
import micromatch from "micromatch"
import { treeshake } from "./methods/treeshake"

export type TypezerOptions = {
	files?: string[]
	symbols?: string[] // list of target symbols
	useReferences?: boolean // whether to use references or to embed all types (may cause circular reference issues)
	compilerOptions?: ts.CompilerOptions
}

export class Typezer {
	public readonly compilerOptions: ts.CompilerOptions

	public files: Array<string>
	public readonly useReferences: boolean
	public readonly symbols?: string[]
	public readonly matchRootSymbol: (value: string) => boolean
	public sourceFiles: readonly ts.SourceFile[] = []
	public localSourceFiles: readonly ts.SourceFile[] = []
	public entrySourceFiles: readonly ts.SourceFile[] = []
	public schema: Schema = {}
	public fullSchema: Schema = {}
	public declarations: Declaration[] = []
	public rawDeclarations: RawDeclaration[] = []

	protected path: Path = [] // path of the current type
	protected typeCache = new Map<ts.Type, { path: Path; type?: Type }>()

	protected checker: ts.TypeChecker
	protected program: ts.Program
	protected watcher?: FSWatcher
	protected host: ts.CompilerHost
	protected sourceFileCache = new Map<string, ts.SourceFile | undefined>()

	constructor({
		files = [],
		symbols,
		useReferences = true,
		compilerOptions = {},
	}: TypezerOptions) {
		this.useReferences = useReferences
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

	protected parseSourceFile = parseSourceFile.bind(this)
	protected parseSourceFiles = parseSourceFiles.bind(this)

	protected createHost = createHost.bind(this)
	protected startProgram = startProgram.bind(this)
	protected getSourceFiles = getSourceFiles.bind(this)
	protected updateWatchedFiles = updateWatchedFiles.bind(this)

	protected createRawDeclaration = createRawDeclaration.bind(this)
	protected createType = createType.bind(this)
	protected createManyTypes = createManyTypes.bind(this)
	protected getRawDeclarationType = getRawDeclarationType.bind(this)
	protected getRawDeclarationTypes = getRawDeclarationTypes.bind(this)
	protected refineRawDeclaration = refineRawDeclaration.bind(this)
	protected createProperties = createProperties.bind(this)
	protected createSchema = createSchema.bind(this)
	protected treeshake = treeshake.bind(this)
}
