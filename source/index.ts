import ts from "typescript"
import { WatcherCallback } from "./types/WatcherCallback"
import { Typezer } from "./Typezer"

export { Typezer } from "./Typezer"

export const watch = (
	files: string[],
	onChange: WatcherCallback,
	options: ts.CompilerOptions = {}
) => new Typezer(files, options).watch(onChange)
