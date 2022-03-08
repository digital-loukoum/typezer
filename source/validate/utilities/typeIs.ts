import type { Type } from "../../types/Type/Type"
import type * as Types from "../../types/Type/Types"

export const typeIs = {
	union: (type: Type): type is Types.UnionType => type.type == "Union",

	enumeration: (type: Type): type is Types.EnumerationType => type.type == "Enumeration",

	stringLiteral: (type: Type): type is Types.StringLiteralType =>
		type.type == "StringLiteral",

	numberLiteral: (type: Type): type is Types.NumberLiteralType =>
		type.type == "NumberLiteral",

	stringOrNumberLiteral: (
		type: Type
	): type is Types.StringLiteralType | Types.NumberLiteralType =>
		typeIs.numberLiteral(type) || typeIs.stringLiteral(type),
}
