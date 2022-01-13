import ts from "typescript"
import { getOriginalBaseTypes } from "../../utilities/getOriginalBaseType"
import { typeToString } from "../../utilities/typeToString"
import { Type } from "./Type"
import * as Types from "./Types"

export function createType(tsType: ts.Type, tsNode: ts.Node): Type {
	const originalBaseTsTypes = getOriginalBaseTypes(tsType)
	let priority = -Infinity
	let type: Type | undefined = undefined
	console.log(typeToString(tsType), (tsType as any).id)

	for (const originalTsType of originalBaseTsTypes) {
		for (const TypeConstructor of Object.values(Types)) {
			// objects are used in last resort
			if (TypeConstructor == Types.ObjectType) continue

			const challenger = TypeConstructor.fromTsType(originalTsType, tsNode)
			if (challenger && TypeConstructor.priority > priority) {
				type = challenger
				priority = TypeConstructor.priority
			}
		}
	}

	// if the type could not be guessed, it's a generic object
	if (!type) return Types.ObjectType.fromTsType(tsType, tsNode)
	return type
}
