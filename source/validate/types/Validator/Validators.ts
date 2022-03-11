import type { TypeName } from "../../../types/Type_old/TypeName"
import { ValidatorFunction } from "./ValidatorFunction"

export type Validators = {
	[Key in TypeName]: ValidatorFunction
}
