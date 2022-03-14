import { Declaration } from "./types/Declaration/Declaration"
import { Path } from "./types/Path/Path"
import { Schema } from "./types/Schema"
import { Validator } from "./types/Validator/Validator"

export function validate(
	schema: Schema,
	value: unknown,
	declarationId: string,
	path: Path = []
) {
	return new Validator(schema).validate(value, declarationId, path).errors
}
