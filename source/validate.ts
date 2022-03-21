import { Path } from "./types/Path/Path"
import { Schema } from "./types/Schema/Schema"
import { Callable } from "./types/Signature/Callable"
import type { Type } from "./types/Type/Type"
import { Validator } from "./types/Validator/Validator"

export function validatePath(schema: Schema, path: Path = [], value: unknown) {
	return new Validator(schema).validatePath(path, value).errors
}

export function validate(schema: Schema, type: Type, value: unknown) {
	return new Validator(schema).validate(type, value).errors
}

export function validateSignature<Type extends Callable>(
	schema: Schema,
	type: Type,
	value: unknown[]
) {
	return new Validator(schema).validateSignature(type, value)
}

export function validateSignaturePath(schema: Schema, path: Path = [], value: unknown[]) {
	return new Validator(schema).validateSignaturePath(path, value)
}
