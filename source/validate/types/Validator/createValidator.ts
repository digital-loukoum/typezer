import type { Definitions } from "../../../types/Definition/definitions"
import { Validator } from "./Validator"

export function createValidator(definitions: Definitions): Validator {
	return new Validator(definitions)
}
