import ts from "typescript"
import glob from "fast-glob"
import { FSWatcher } from "chokidar"
import { print } from "@digitak/print"
import { resolve } from "path"
import { Scope } from "../Scope/Scope"
import { parseSourceFiles } from "./methods/parseSourceFiles"
import { getSourceFiles } from "./methods/getSourceFiles"
import { startProgram } from "./methods/startProgram"
import { updateWatchedFiles } from "./methods/updateWatchedFiles"
import { createHost } from "./methods/createHost"
import { watch } from "./methods/watch"
import { parseSourceFile } from "./methods/parseSourceFile"
import { RawDeclaration } from "../Declaration/RawDeclaration"
import { createRawDeclaration } from "./methods/createRawDeclaration"
import { createDeclaration } from "./methods/createDeclaration"
import { createType } from "./methods/createType"

export class Typezer {
	public readonly options: ts.CompilerOptions

	public files: Array<string>
	public sourceFiles: readonly ts.SourceFile[] = []
	public localSourceFiles: readonly ts.SourceFile[] = []
	public entrySourceFiles: readonly ts.SourceFile[] = []

	public get declarations() {
		return this.scope.global
	}
	protected set declarations(value: RawDeclaration[]) {
		this.scope.global = value
	}

	protected scope = new Scope([])

	protected checker: ts.TypeChecker
	protected program: ts.Program
	protected watcher?: FSWatcher
	protected host: ts.CompilerHost
	protected sourceFileCache = new Map<string, ts.SourceFile | undefined>()

	constructor(files: string[], options: ts.CompilerOptions = {}) {
		this.files = files
			.map(file => glob.sync(file))
			.flat()
			.map(file => resolve(file))

		if (!this.files.length) {
			print`[yellow:No files found matching ${JSON.stringify(files)}]`
		}

		this.options = {
			skipDefaultLibCheck: true,
			noEmit: true,
			...options,
		}

		this.host = this.createHost()
		this.program = this.startProgram()
		this.checker = this.program.getTypeChecker()
	}

	public watch = watch.bind(this)

	protected createRawDeclaration = createRawDeclaration.bind(this)
	protected createDeclaration = createDeclaration.bind(this)
	protected createType = createType.bind(this)

	protected parseSourceFile = parseSourceFile.bind(this)
	protected parseSourceFiles = parseSourceFiles.bind(this)

	protected createHost = createHost.bind(this)
	protected startProgram = startProgram.bind(this)
	protected getSourceFiles = getSourceFiles.bind(this)
	protected updateWatchedFiles = updateWatchedFiles.bind(this)
}