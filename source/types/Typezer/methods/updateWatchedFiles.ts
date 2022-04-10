import chokidar, { FSWatcher } from "chokidar"
import { getWatchedFiles } from "../../../utilities/getWatchedFiles.js"
import { Typezer } from "../Typezer.js"

export function updateWatchedFiles(this: Typezer): FSWatcher {
	const filesToWatch = this.sourceFiles.map(({ fileName }) => fileName)
	if (!this.watcher) this.watcher = chokidar.watch(filesToWatch)
	const watchedFiles = getWatchedFiles(this.watcher)

	for (const file of filesToWatch) {
		if (!watchedFiles.includes(file)) this.watcher.add(file)
	}

	for (const file of watchedFiles) {
		if (!filesToWatch.includes(file)) this.watcher.unwatch(file)
	}

	return this.watcher
}
