import ts from "typescript"
import { createProperties } from "../types/Properties/createProperties"
import { Properties } from "../types/Properties/Properties"
import { getTypeChecker } from "./typeChecker"

export function nodeToProperties(tsNode: ts.Node): Properties {
	const tsType = getTypeChecker().getTypeAtLocation(tsNode)
	return createProperties(tsType, tsNode)
}
