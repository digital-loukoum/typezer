import { Declaration } from "../../Declaration/Declaration"
import { RawDeclaration } from "../../Declaration/RawDeclaration"
import { Type } from "../../Type/Type"
import { Typezer } from "../Typezer"

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
