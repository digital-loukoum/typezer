import { Schema } from "./types/Schema/Schema"
import { findPathTarget } from "./types/Type/findPathTarget"
import { Validator } from "./types/Validator/Validator"

function findTargetInSchema(schema: Schema, path: string | Array<string>) {
	if (typeof path == "string") return schema[path]
	return findPathTarget(schema[path[0]], path.slice(1))
}

export function validateType(
	schema: Schema,
	path: string | Array<string>,
	value: unknown
) {
	const type = findTargetInSchema(schema, path)
	if (!type) return [`Invalid path '${path}'`]
	return new Validator(schema).validate(type, value).errors
}

export function validateSignature(
	schema: Schema,
	path: string | Array<string>,
	value: unknown[]
) {
	const type = findTargetInSchema(schema, path)
	if (!type) return { errors: [`Invalid path '${path}'`] }

	if (type.typeName != "Function") {
		return { errors: [`Type '${type}' is not a function`] }
	}

	return new Validator(schema).validateSignature(type, value)
}
