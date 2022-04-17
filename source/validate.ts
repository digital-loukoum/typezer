import { findTargetInSchema } from "./types/Type/findPathTarget.js"
import { Type } from "./types/Type/Type.js"
import { Validator } from "./types/Validator/Validator.js"

export function validateType(
	schema: Record<string, Type>,
	path: string | Array<string>,
	value: unknown
) {
	const type = findTargetInSchema(schema, path)
	if (!type) throw new Error(`Invalid path '${path}'`)
	return new Validator(schema).validate(type, value).errors
}

export function validateSignature(
	schema: Record<string, Type>,
	path: string | Array<string>,
	value: unknown[]
) {
	const type = findTargetInSchema(schema, path)
	if (!type) throw new Error(`Invalid path '${path}'`)

	if (type.typeName != "Function") {
		return { errors: [`Type '${type}' is not a function`] }
	}

	return new Validator(schema).validateSignature(type, value)
}
