import { toString } from "../../Type/toString"
import { Type } from "../../Type/Type"
import { Typezer } from "../Typezer"

export function typeToString(this: Typezer, type: Type): string {
	const stringifiers = toString.call(this)
	const { typeName } = type
	return stringifiers[typeName]?.(type as any) ?? type.typeName
}
