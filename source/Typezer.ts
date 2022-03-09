import ts from "typescript"
import { Declaration } from "./types/Declaration/Declaration"
import { Definitions, resetDefinitions } from "./types/Definition/definitions"
import { createSourceFile } from "./types/SourceFile/createSourceFile"
import { SourceFile } from "./types/SourceFile/SourceFile"
import { setTypeChecker } from "./utilities/typeChecker"
import glob from "fast-glob"
import chokidar, { FSWatcher } from "chokidar"
import { WatcherCallback } from "./types/WatcherCallback"
import { print } from "@digitak/print"
import { resolve } from "path"
import { getDependentSourceFiles } from "./utilities/getDependentSourceFiles"
import { getWatchedFiles } from "./utilities/getWatchedFiles"

export class Typezer {
	public readonly options: ts.CompilerOptions

	public files: Array<string>
	public tsSourceFiles: readonly ts.SourceFile[] = []
	public localSourceFiles: readonly SourceFile[] = []
	public entrySourceFiles: readonly SourceFile[] = []

	public declarations: Declaration[] = []
	public definitions: Definitions = {}

	protected tsProgram!: ts.Program
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
		this.startProgram()
	}

	watch(callback?: WatcherCallback) {
		callback?.({
			definitions: this.definitions,
			declarations: this.declarations,
		})

		this.watcher = this.updateWatchedFiles()
		let timeout: null | NodeJS.Timeout = null
		const timeoutDuration = 150

		this.watcher.on("change", path => {
			// print`[yellow:Change: [underline:${path}]]`
			if (timeout) clearTimeout(timeout)

			const sourceFile = this.tsProgram.getSourceFile(path)
			if (!sourceFile) {
				print`[yellow:Could not find source file for module ${path}]`
				return
			}

			// we invalidate the changed module
			this.sourceFileCache.delete(path)

			// we also find and invalidate all modules that depend on the changed module
			const dependents = getDependentSourceFiles(this.tsProgram, sourceFile)
			dependents.forEach(({ fileName }) => this.sourceFileCache.delete(fileName))

			timeout = setTimeout(() => {
				this.startProgram()
				this.updateWatchedFiles()

				callback?.({
					definitions: this.definitions,
					declarations: this.declarations,
				})
				timeout = null
			}, timeoutDuration)
		})
	}

	protected updateWatchedFiles(): FSWatcher {
		const filesToWatch = this.tsSourceFiles.map(({ fileName }) => fileName)
		if (!this.watcher) this.watcher = chokidar.watch(filesToWatch)
		const watchedFiles = getWatchedFiles(this.watcher)

		// console.log(
		// 	"filesToWatch",
		// 	filesToWatch.filter(file => !file.includes("/node_modules/"))
		// )
		// console.log(
		// 	"watchedFiles",
		// 	watchedFiles.filter(file => !file.includes("/node_modules/"))
		// )

		for (const file of filesToWatch) {
			if (!watchedFiles.includes(file)) this.watcher.add(file)
		}

		for (const file of watchedFiles) {
			if (!filesToWatch.includes(file)) this.watcher.unwatch(file)
		}

		return this.watcher
	}

	protected startProgram() {
		this.tsProgram = ts.createProgram(this.files, this.options, this.host)
		this.definitions = resetDefinitions()

		setTypeChecker(this.tsProgram.getTypeChecker())

		this.tsSourceFiles = this.tsProgram.getSourceFiles()

		// we find our local source files
		this.localSourceFiles = this.tsSourceFiles
			.filter(tsSourceFile => !tsSourceFile.fileName.includes("node_modules"))
			.map(tsSourceFile => createSourceFile(tsSourceFile))

		this.entrySourceFiles = this.localSourceFiles.filter(({ name }) =>
			this.files.includes(name)
		)

		// we discover all declarations
		this.declarations = []
		for (const file of this.entrySourceFiles) {
			this.declarations = this.declarations.concat(file.getDeclarations())
		}
	}

	protected createHost() {
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
