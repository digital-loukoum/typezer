import type { Type } from "../Type/Type"
import type { Path } from "../Path/Path"
import inspect from "object-inspect"
import { validators } from "./validators"
import { getSchemaReference } from "../Schema/getSchemaReference"
import { Schema } from "../Schema/Schema"

export class Validator {
	errors: Array<string> = []
	path: Array<string> = []
	validated = new WeakMap<Type, Set<unknown>>()
	validators = validators.call(this)

	constructor(public schema: Schema) {}

	validatePath = (path: Path = [], value: unknown) => {
		const type = getSchemaReference(this.schema, path)
		return this.validate(type, value)
	}

	validate = (type: Type, value: unknown) => {
		let validatedValues = this.validated.get(type)
		if (!validatedValues) this.validated.set(type, (validatedValues = new Set()))

		if (!validatedValues.has(value)) {
			validatedValues.add(value)
			this.validators[type.typeName]?.(type as any, value)
		}

		return this
	}

	mismatch = (value: any, expected: any) => {
		const path = this.joinPath()
		const pathInfos = path ? `at '${this.joinPath()}'` : ""
		this.errors.push(
			`Expected ${inspect(expected)} but received ${inspect(value)} ${pathInfos}`
		)
	}

	missing = (key: string) => {
		const path = this.joinPath()
		const pathInfos = path ? `in '${this.joinPath()}'` : ""
		this.errors.push(`Key '${key}' missing ${pathInfos}`)
	}

	/**
	 * Create a new validator that shares the validated values
	 */
	fork = () => {
		const forked = new Validator(this.schema)
		forked.validated = this.validated
		return forked
	}

	joinPath = () => {
		return this.path.join(".")
	}
}
