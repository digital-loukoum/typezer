import type { TypeName } from "../../../types/Type/TypeName"
import { ValidatorFunction } from "./ValidatorFunction"

export type Validators = {
	[Key in TypeName]: ValidatorFunction
}
