import { Schema } from "./types/Schema/Schema"
import { Callable } from "./types/Signature/Callable"
import type { Type } from "./types/Type/Type"
import { Validator } from "./types/Validator/Validator"

export function validate(schema: Schema, type: Type, value: unknown) {
	return new Validator(schema).validate(type, value).errors
}

export function validateSignature<CallableType extends Callable>(
	schema: Schema,
	type: CallableType,
	value: unknown[]
) {
	return new Validator(schema).validateSignature(type, value)
}
