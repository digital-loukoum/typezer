import type { Type } from "../types/Type/Type"
import type { ValidationError } from "./types/ValidationError/ValidationError"
import { createValidator } from "./types/Validator/createValidator"

export function validate(schema: Type, value: unknown): Array<ValidationError> {
	return createValidator().validate(schema, value).errors
}
