import { FSWatcher } from "chokidar"
import { join } from "path"

/**
 * Transform a 2-level description of watched files into a single list
 */
export function getWatchedFiles(watcher: FSWatcher): string[] {
	const watched: string[] = []
	const chokidarWatched = watcher.getWatched()

	for (const directory in chokidarWatched) {
		watched.push(...chokidarWatched[directory].map(file => join(directory, file)))
	}

	return watched
}
