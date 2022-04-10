import ts from "typescript"
import { RawDeclaration } from "../../Declaration/RawDeclaration.js"
import { Type } from "../../Type/Type.js"
import { Typezer } from "../Typezer.js"

export function getRawDeclarationType(
	this: Typezer,
	{ id, declare, node, rawType }: RawDeclaration
): Type {
	if (declare == "default") {
		if (node.kind == ts.SyntaxKind.NumericLiteral) {
			return {
				typeName: "NumberLiteral",
				value: +node.getText(),
			}
		} else if (node.kind == ts.SyntaxKind.StringLiteral) {
			return {
				typeName: "StringLiteral",
				value: node.getText(),
			}
		}
	}

	return this.createType(rawType, node)
}
