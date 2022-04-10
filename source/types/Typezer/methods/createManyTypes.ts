import ts from "typescript"
import { Type } from "../../Type/Type.js"
import { Typezer } from "../Typezer.js"

export function createManyTypes(
	this: Typezer,
	rawTypes: readonly ts.Type[],
	node: ts.Node
): Type[] {
	return rawTypes.map(rawType => this.createType(rawType, node))
}
