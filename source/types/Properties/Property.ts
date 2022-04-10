import { Modifier } from "../Modifier/Modifier.js"
import { Type } from "../Type/Type.js"

export type Property = Type & {
	optional?: boolean
	modifiers?: Modifier[]
}
