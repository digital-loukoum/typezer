import { Type } from "./Type.js"

export const isReferencable = ({ typeName }: Type) =>
	!(
		typeName == "Never" ||
		typeName == "Boolean" ||
		typeName == "Null" ||
		typeName == "Void" ||
		typeName == "Undefined" ||
		typeName == "RegularExpression" ||
		typeName == "BigInteger" ||
		typeName == "Date" ||
		typeName == "Symbol" ||
		typeName == "Number" ||
		typeName == "StringLiteral" ||
		typeName == "BigIntegerLiteral" ||
		typeName == "BooleanLiteral" ||
		typeName == "Any" ||
		typeName == "NumberLiteral" ||
		typeName == "TemplateLiteral" ||
		typeName == "ArrayBuffer" ||
		typeName == "Function" ||
		typeName == "String"
	)
