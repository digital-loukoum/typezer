export class ValidationErrors extends Array<string> {
	mismatch(value: any, expected: any, path: string[]) {
		this.push(
			`Expected ${expected} but received ${value} at '${ValidationErrors.joinPath(path)}'`
		)
	}

	missing(key: string, path: string[]) {
		this.push(`Key '${key}' missing in '${ValidationErrors.joinPath(path)}'`)
	}

	static joinPath(path: string[]) {
		return path.join(".")
	}
}
