import type { Type } from "../../../types/Type_old/Type"
import type { Definitions } from "../../../types/Definition/definitions"
import { createValidators } from "./createValidators"
import { inspect } from "util"
export class Validator {
	errors: Array<string> = []
	path: Array<string> = []
	validated = new WeakMap<Type, Set<unknown>>()
	validators = createValidators(this)

	constructor(public definitions: Definitions) {}

	validate(type: Type, value: unknown) {
		let validatedValues = this.validated.get(type)
		if (!validatedValues) this.validated.set(type, (validatedValues = new Set()))
		if (validatedValues.has(value)) return this
		validatedValues.add(value)
		this.validators[type.typeName as keyof typeof this.validators](type, value)
		return this
	}

	mismatch(value: any, expected: any) {
		const path = this.joinPath()
		const pathInfos = path ? `at '${this.joinPath()}'` : ""
		this.errors.push(
			`Expected ${inspect(expected)} but received ${inspect(value)} ${pathInfos}`
		)
	}

	missing(key: string) {
		const path = this.joinPath()
		const pathInfos = path ? `in '${this.joinPath()}'` : ""
		this.errors.push(`Key '${key}' missing ${pathInfos}`)
	}

	/**
	 * Create a new validator that shares the validated values
	 */
	fork() {
		const forked = new Validator(this.definitions)
		forked.validated = this.validated
		return forked
	}

	joinPath() {
		return this.path.join(".")
	}
}
