import { Declaration } from "../../Declaration/Declaration.js"
import { RawDeclaration } from "../../Declaration/RawDeclaration.js"
import { Type } from "../../Type/Type.js"
import { Typezer } from "../Typezer.js"

export function refineRawDeclaration(
	this: Typezer,
	{ id, name, fileName, declare, exportedAs, type }: RawDeclaration
): Declaration {
	return {
		id,
		name,
		fileName,
		declare,
		exportedAs,
		...(type as Type),
	}
}
