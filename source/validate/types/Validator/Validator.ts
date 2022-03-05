import type { Type } from "../../../types/Type/Type"
import { createValidators } from "./createValidators"

export class Validator {
	errors: Array<string> = []
	path: Array<string> = []
	validated = new WeakMap<Type, Set<unknown>>()
	validators = createValidators(this)

	validate(type: Type, value: unknown) {
		let validatedValues = this.validated.get(type)
		if (!validatedValues) this.validated.set(type, (validatedValues = new Set()))
		if (validatedValues.has(value)) return this
		validatedValues.add(value)
		this.validators[type.type as keyof typeof this.validators](type, value)
		return this
	}

	mismatch(value: any, expected: any) {
		this.errors.push(`Expected ${expected} but received ${value} at '${this.joinPath()}'`)
	}

	missing(key: string) {
		this.errors.push(`Key '${key}' missing in '${this.joinPath()}'`)
	}

	/**
	 * Create a new validator that shares the validated values
	 */
	fork() {
		const forked = new Validator()
		forked.validated = this.validated
		return forked
	}

	joinPath() {
		return this.path.join(".")
	}
}
