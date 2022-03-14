// return the base name of a filename (no folder, no extension)
export function basename(fileName: string) {
	const lastSlash = Math.max(fileName.lastIndexOf("/"), fileName.lastIndexOf("\\"))
	const lastDot = fileName.lastIndexOf(".")
	return ~lastDot ? fileName.slice(lastSlash + 1, lastDot) : fileName.slice(lastSlash + 1)
}
