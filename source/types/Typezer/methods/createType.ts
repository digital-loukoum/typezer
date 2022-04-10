import ts from "typescript"
import { Typezer } from "../Typezer.js"
import { getOriginalBaseTypes } from "../../../utilities/getOriginalBaseType.js"
import { Type } from "../../Type/Type.js"
import { TypeName } from "../../Type/TypeName.js"
import { getScopeReference } from "../../Scope/getScopeReference.js"
import { ScopeItem } from "../../Scope/ScopeItem.js"

export function createType(this: Typezer, rawType: ts.Type, node: ts.Node): Type {
	// we check if the item is a parent (circular reference) or a generic (generic reference)
	const reference = getScopeReference(this.scope, rawType)
	if (reference) return reference

	const scopeItem: ScopeItem = {
		rawType,
		rawGenerics: this.utilities.getRawGenerics(rawType),
	}

	const generics: Record<string, Type> = {}
	for (const name in scopeItem.rawGenerics) {
		generics[name] = this.createType(scopeItem.rawGenerics[name], node)
	}

	this.scope.push(scopeItem)
	// console.log("node", node)
	// console.log("rawType", rawType.symbol?.escapedName, rawType)

	// we traverse all base types of the given type to look for its true type
	const baseRawTypes = getOriginalBaseTypes(rawType)
	let currentPriority = -Infinity
	let type: Type | undefined = undefined

	for (const baseRawType of baseRawTypes) {
		let typeName: TypeName

		for (typeName in this.creators) {
			// objects are used in last resort
			if (typeName == "Object") continue

			const { create, priority } = this.creators[typeName]

			if ((priority ?? 0) > currentPriority) {
				const challenger = create?.({
					rawType: baseRawType,
					node,
				})
				if (challenger) {
					type = challenger
					currentPriority = priority ?? 0
				}
			}
		}
	}

	// if the type could not be guessed, it's a regular object or a generic
	if (!type) {
		// let target: ts.Type
		// let cachedTarget

		// if (
		// 	(target = getTypeTarget(rawType)) != rawType &&
		// 	(cachedTarget = this.typeCache.get(target))
		// ) {
		// 	// then the type is a reference to a generic
		// 	const typeParameters = this.utilities
		// 		.getTypeArguments(rawType)
		// 		?.map(rawTypeParameter => this.createType(rawTypeParameter, node))

		// 	return {
		// 		typeName: "Reference",
		// 		path: cachedTarget.path,
		// 		...(typeParameters ? { typeParameters } : {}),
		// 	}
		// } else {
		// else the type is a plain object
		type = this.creators.Object.create!({ rawType, node })!
		// }
	}

	this.scope.pop()

	return type
}
