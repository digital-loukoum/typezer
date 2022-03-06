import ts from "typescript"
import { getExportedNodeName } from "../../utilities/getExportedNodeName"
import { SourceFile } from "../SourceFile/SourceFile"
import { Declaration } from "./Declaration"
import * as Declarations from "./Declarations"

export function createDeclaration(
	file: string,
	name: string,
	tsNode: ts.Node
): Declaration {
	for (const Declaration of Object.values(Declarations)) {
		const declaration = Declaration.fromTsNode(tsNode, name)
		if (declaration) {
			declaration.file = file
			declaration.name = name
			return declaration
		}
	}
	throw `The given node is not a declaration: ${ts.SyntaxKind[tsNode.kind]}`
}
