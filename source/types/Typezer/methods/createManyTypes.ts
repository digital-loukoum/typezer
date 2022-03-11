import ts from "typescript"
import { Type } from "../../Type/Type"
import { Typezer } from "../Typezer"

export function createManyTypes(
	this: Typezer,
	rawTypes: readonly ts.Type[],
	node: ts.Node
): Type[] {
	return rawTypes.map(rawType => this.createType(rawType, node))
}
