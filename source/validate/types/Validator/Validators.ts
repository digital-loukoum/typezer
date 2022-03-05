import type { TypeName } from "../../../types/Type/TypeName"

export type Validators = {
	[Key in TypeName]: (type: any, value: any) => void
}
