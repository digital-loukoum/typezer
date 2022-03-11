import type { Type } from "../../types/Type/Type"
import type * as Types from "../../types/Type/Types"

export const typeIs = {
	union: (type: Type): type is Types.UnionType => type.typeName == "Union",

	enumeration: (type: Type): type is Types.EnumerationType =>
		type.typeName == "Enumeration",

	stringLiteral: (type: Type): type is Types.StringLiteralType =>
		type.typeName == "StringLiteral",

	numberLiteral: (type: Type): type is Types.NumberLiteralType =>
		type.typeName == "NumberLiteral",

	stringOrNumberLiteral: (
		type: Type
	): type is Types.StringLiteralType | Types.NumberLiteralType =>
		typeIs.numberLiteral(type) || typeIs.stringLiteral(type),
}
