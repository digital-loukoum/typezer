import { Type } from "./Type"

export const isPrimitive = ({ typeName }: Type) =>
	typeName == "Boolean" ||
	typeName == "Null" ||
	typeName == "Void" ||
	typeName == "Undefined" ||
	typeName == "RegularExpression" ||
	typeName == "BigInteger" ||
	typeName == "Date" ||
	typeName == "Number" ||
	typeName == "StringLiteral" ||
	typeName == "BigIntegerLiteral" ||
	typeName == "BooleanLiteral" ||
	typeName == "Any" ||
	typeName == "NumberLiteral" ||
	typeName == "TemplateLiteral" ||
	typeName == "ArrayBuffer" ||
	typeName == "String"
