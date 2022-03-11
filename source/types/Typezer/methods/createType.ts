import ts from "typescript"
import { getTypeId } from "../../../utilities/getTypeId"
import { RawDeclaration } from "../../Declaration/RawDeclaration"
import { Type } from "../../Type/Type"
import { Typezer } from "../Typezer"
import * as Types from "../../Type/Types"
import { getOriginalBaseTypes } from "../../../utilities/getOriginalBaseType"

const typeConstructors = Object.values(Types)

export function createType(
	this: Typezer,
	rawType: ts.Type,
	node: ts.Node,
	rawDeclaration?: RawDeclaration
): Type {
	const reference = this.scope.findReferenceDeclaration(getTypeId(rawType))
	if (reference) return new Types.ReferenceType(reference.id)

	const originalBaseTsTypes = getOriginalBaseTypes(rawType)
	let priority = -Infinity
	let type: Type | undefined = undefined

	for (const originalTsType of originalBaseTsTypes) {
		for (const TypeConstructor of typeConstructors) {
			// objects are used in last resort
			if (TypeConstructor == Types.ObjectType) continue

			const challenger = TypeConstructor.fromTsType(originalTsType, node)
			if (challenger && TypeConstructor.priority > priority) {
				type = challenger
				priority = TypeConstructor.priority
			}
		}
	}

	// if the type could not be guessed, it's a regular object
	if (!type) type = Types.ObjectType.fromTsType(rawType, node)

	return type
}
