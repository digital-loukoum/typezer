import ts from "typescript"
import { getOriginalBaseTypes } from "../../utilities/getOriginalBaseType"
import { typeToString } from "../../utilities/typeToString"
import { ReferenceType, ResolvingType } from "./SpecialTypes"
import { Type } from "./Type"
import * as Types from "./Types"

const cache = new Map<number, Type>()

export function createType(tsType: ts.Type, tsNode: ts.Node): Type {
	const originalBaseTsTypes = getOriginalBaseTypes(tsType)
	let priority = -Infinity
	let type: Type | undefined = undefined

	const id: number = (tsType as any).id
	const cached = cache.get(id)
	if (cached) return new ReferenceType(cached.id)
	else cache.set(id, new ResolvingType(id))

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
	if (!type) type = Types.ObjectType.fromTsType(tsType, tsNode)
	type.id = id
	cache.set(id, type)

	return type
}
