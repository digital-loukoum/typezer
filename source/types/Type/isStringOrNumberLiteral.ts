import { Type } from "./Type"
import { TypeName } from "./TypeName"
import { Types } from "./Types"

export function isStringOrNumberLiteral(
	type: Type
): type is Types["StringLiteral"] | Types["NumberLiteral"] {
	return (<TypeName[]>["StringLiteral", "NumberLiteral"]).includes(type.typeName)
}
