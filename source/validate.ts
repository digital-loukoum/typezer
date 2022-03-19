import { Path } from "./types/Path/Path"
import { Schema } from "./types/Schema/Schema"
import type { Type } from "./types/Type/Type"
import { Validator } from "./types/Validator/Validator"

export function validate(
	schema: Schema,
	value: unknown,
	declarationId: string,
	path: Path = []
) {
	return new Validator(schema).validate(value, declarationId, path).errors
}

export function validateType(schema: Schema, type: Type, value: unknown) {
	return new Validator(schema).validateType(type, value).errors
}
