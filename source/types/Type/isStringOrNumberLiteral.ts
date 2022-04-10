import { Type } from "./Type.js"
import { TypeName } from "./TypeName.js"
import { Types } from "./Types.js"

export function isStringOrNumberLiteral(
	type: Type
): type is Types["StringLiteral"] | Types["NumberLiteral"] {
	return (<TypeName[]>["StringLiteral", "NumberLiteral"]).includes(type.typeName)
}
