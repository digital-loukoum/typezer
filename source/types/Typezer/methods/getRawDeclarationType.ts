import ts from "typescript"
import { RawDeclaration } from "../../Declaration/RawDeclaration"
import { Type } from "../../Type/Type"
import { Typezer } from "../Typezer"

export function getRawDeclarationType(
	this: Typezer,
	rawDeclaration: RawDeclaration
): Type {
	if (rawDeclaration.declare == "default") {
		const children = rawDeclaration.node.getChildren()
		const lastChildNode = children[children.length - 1]

		if (lastChildNode.kind == ts.SyntaxKind.NumericLiteral) {
			return {
				typeName: "NumberLiteral",
				value: +lastChildNode.getText(),
			}
		} else if (lastChildNode.kind == ts.SyntaxKind.StringLiteral) {
			return {
				typeName: "StringLiteral",
				value: lastChildNode.getText(),
			}
		}
	}

	return this.createType(rawDeclaration.rawType, rawDeclaration.node)
}
