import ts from "typescript"
import { Declaration } from "./Declaration"
import * as Declarations from "./Declarations"

export function createDeclaration(tsNode: ts.Node): Declaration {
	for (const Declaration of Object.values(Declarations)) {
		const declaration = Declaration.fromTsNode(tsNode)
		if (declaration) return declaration
	}
	throw `The given node is not a declaration: ${ts.SyntaxKind[tsNode.kind]}`
}
