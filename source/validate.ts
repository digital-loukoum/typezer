import { Path } from "./types/Path/Path"
import { Schema } from "./types/Schema/Schema"
import type { Type } from "./types/Type/Type"
import { Validator } from "./types/Validator/Validator"

export function validatePath(schema: Schema, path: Path = [], value: unknown) {
	return new Validator(schema).validatePath(path, value).errors
}

export function validate(schema: Schema, type: Type, value: unknown) {
	return new Validator(schema).validate(type, value).errors
}
