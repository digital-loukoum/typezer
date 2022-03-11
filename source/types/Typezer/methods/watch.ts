import { getDependentSourceFiles } from "../../../utilities/getDependentSourceFiles"
import { WatcherCallback } from "../../WatcherCallback"
import { Typezer } from "../Typezer"

export function watch(this: Typezer, callback?: WatcherCallback) {
	callback?.({
		definitions: this.definitions,
		declarations: this.declarations,
	})

	this.watcher = this.updateWatchedFiles()

	this.watcher.on("change", path => {
		this.watcher?.close()
		// print`[yellow:Change: [underline:${path}]]`

		const sourceFile = this.tsProgram.getSourceFile(path)
		if (!sourceFile) {
			print`[yellow:Could not find source file for module ${path}]`
			return
		}

		// we also find and invalidate all modules that depend on the changed module
		const dependents = getDependentSourceFiles(
			this.tsProgram,
			sourceFile,
			new Set([sourceFile])
		)
		dependents.forEach(({ fileName }) => this.sourceFileCache.delete(fileName))

		this.startProgram()
		this.watch(callback)
	})
}
