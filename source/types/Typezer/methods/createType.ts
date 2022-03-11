import ts from "typescript"
import { RawDeclaration } from "../../Declaration/RawDeclaration"
import { Typezer } from "../Typezer"
import { getOriginalBaseTypes } from "../../../utilities/getOriginalBaseType"
import { Type, TypeName } from "../../Type/Type"
import { getTypeId } from "../../../utilities/getTypeId"

export function createType(this: Typezer, rawType: ts.Type, node: ts.Node): Type {
	// we check if the type has not been already defined
	const reference = this.scope.findReferenceDeclaration(getTypeId(rawType))
	if (reference) {
		return {
			typeName: "Reference",
			id: reference.id,
		}
	}

	// we traverse all base types of the given type to look for its true type
	const baseRawTypes = getOriginalBaseTypes(rawType)
	let priority = -Infinity
	let type: Type | undefined = undefined

	for (const baseRawType of baseRawTypes) {
		let typeName: TypeName

		for (typeName in this.types) {
			// objects are used in last resort
			if (typeName == "Object") continue

			const constructor = this.types[typeName]

			const challenger = constructor.create?.(baseRawType, node)
			if (challenger && (constructor.priority ?? 0) > priority) {
				;(type = challenger), (priority = constructor.priority ?? 0)
			}
		}
	}

	// if the type could not be guessed, it's a regular object
	if (!type) type = this.types.Object.create!(rawType, node)!

	return type
}
