import type { Definitions } from "../types/Definition/definitions"
import type { Type } from "../types/Type/Type"
import type { ValidationError } from "./types/ValidationError/ValidationError"
import { createValidator } from "./types/Validator/createValidator"

export function validate(
	definitions: Definitions,
	schema: Type,
	value: unknown
): Array<ValidationError> {
	return createValidator(definitions).validate(schema, value).errors
}
