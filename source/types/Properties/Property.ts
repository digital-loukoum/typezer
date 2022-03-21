import { Modifier } from "../Modifier/Modifier"
import { Type } from "../Type/Type"

export type Property = Type & {
	optional?: boolean
	modifiers?: Modifier[]
}
