import { Type } from "../Type/Type"

export class Validator {
	errors: Array<string> = []
	validated = new Map<Type, Set<unknown>>()

	validate(type: Type, value: unknown, path: string[]) {
		let validatedValues = this.validated.get(type)
		if (!validatedValues) this.validated.set(type, (validatedValues = new Set()))
		if (validatedValues.has(value)) return this
		validatedValues.add(value)
		return type.validate(value, path, this)
	}

	mismatch(value: any, expected: any, path: string[]) {
		this.errors.push(
			`Expected ${expected} but received ${value} at '${Validator.joinPath(path)}'`
		)
	}

	missing(key: string, path: string[]) {
		this.errors.push(`Key '${key}' missing in '${Validator.joinPath(path)}'`)
	}

	/**
	 * Create a new validator that shares the validated values
	 */
	fork() {
		const forked = new Validator()
		forked.validated = this.validated
		return forked
	}

	static joinPath(path: string[]) {
		return path.join(".")
	}
}
