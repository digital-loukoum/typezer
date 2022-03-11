import ts from "typescript"
import { Declaration } from "../../Declaration/Declaration"
import { RawDeclaration } from "../../Declaration/RawDeclaration"
import { Type } from "../../Type_old/Type"
import { NumberLiteralType, StringLiteralType } from "../../Type_old/Types"
import { Typezer } from "../Typezer"

export function createDeclaration(
	this: Typezer,
	rawDeclaration: RawDeclaration
): Declaration {
	const { name, rawType, node } = rawDeclaration
	let type: Type | undefined = undefined

	if (name == "default") {
		const children = node.getChildren()
		const lastChildNode = children[children.length - 1]

		if (lastChildNode.kind == ts.SyntaxKind.NumericLiteral)
			type = new NumberLiteralType(+lastChildNode.getText())
		else if (lastChildNode.kind == ts.SyntaxKind.StringLiteral)
			type = new StringLiteralType(lastChildNode.getText())
	}

	type ??= this.createType(rawType, node)

	return {
		...rawDeclaration,
		type,
	}
}
