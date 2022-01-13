import * as Types from "./Types"
import * as SpecialTypes from "./SpecialTypes"

export type Type =
	| typeof Types[keyof typeof Types]["prototype"]
	| typeof SpecialTypes[keyof typeof SpecialTypes]["prototype"]
