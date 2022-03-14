import ts from "typescript"
import { Typezer } from "../Typezer"
import { getOriginalBaseTypes } from "../../../utilities/getOriginalBaseType"
import { Type } from "../../Type/Type"
import { TypeName } from "../../Type/TypeName"
import { PathItem } from "../../Path/PathItem"
import { isPrimitive } from "../../Type/isPrimitive"

export function createType(
	this: Typezer,
	rawType: ts.Type,
	node: ts.Node,
	pathItem?: PathItem
): Type {
	// we check if the type has not been already cached
	let cached = this.typeCache.get(rawType)
	if (cached) {
		if (cached.type && isPrimitive(cached.type)) return { ...cached.type }
		return {
			typeName: "Reference",
			path: cached.path,
		}
	}

	if (pathItem) this.path.push(pathItem)
	this.typeCache.set(rawType, (cached = { path: this.path.slice() }))

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

	if (pathItem) this.path.pop()
	return (cached.type = type)
}
