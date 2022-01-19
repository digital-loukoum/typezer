import { Type } from "./types/Type/Type"
import { Validator } from "./types/Validator/Validator"

export function validate(type: Type, value: any) {
	return new Validator().validate(type, value, [])
}
