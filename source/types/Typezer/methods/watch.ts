import print from "@digitak/print"
import { getDependentSourceFiles } from "../../../utilities/getDependentSourceFiles.js"
import { WatcherCallback } from "../../WatcherCallback.js"
import { Typezer } from "../Typezer.js"

export function watch(this: Typezer, callback?: WatcherCallback) {
	callback?.(this.schema)

	this.watcher = this.updateWatchedFiles()

	this.watcher.on("change", path => {
		this.watcher?.close()
		// print`[yellow:Change: [underline:${path}]]`

		const sourceFile = this.program.getSourceFile(path)
		if (!sourceFile) {
			print`[yellow:Could not find source file for module ${path}]`
			return
		}

		// we also find and invalidate all modules that depend on the changed module
		const dependents = getDependentSourceFiles(
			this.program,
			sourceFile,
			new Set([sourceFile])
		)
		dependents.forEach(({ fileName }) => this.sourceFileCache.delete(fileName))

		this.startProgram()
		this.watch(callback)
	})
}
