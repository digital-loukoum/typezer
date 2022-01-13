import ts from "typescript"
import { createType } from "./createType"
import { Type } from "./Type"

export function createManyTypes(tsTypes: readonly ts.Type[], tsNode: ts.Node): Type[] {
	return tsTypes.map(tsType => createType(tsType, tsNode))
}
