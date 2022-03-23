import ts from "typescript"
import { Typezer } from "../Typezer"
import { getOriginalBaseTypes } from "../../../utilities/getOriginalBaseType"
import { Type } from "../../Type/Type"
import { TypeName } from "../../Type/TypeName"
import { PathItem } from "../../Path/PathItem"
import { isReferencable } from "../../Type/isReferencable"
import { getTypeTarget } from "../../../utilities/getTypeTarget"

export function createType(
	this: Typezer,
	rawType: ts.Type,
	node: ts.Node,
	pathItem?: PathItem
): Type {
	// we check if the type has not been already cached
	let cached = this.useReferences ? this.typeCache.get(rawType) : undefined
	if (cached) {
		if (!cached.type || isReferencable(cached.type)) {
			return {
				typeName: "Reference",
				path: cached.path,
			}
		}
	}

	console.log("node", node)
	console.log("rawType", rawType.symbol?.escapedName, rawType)
	if (pathItem) this.path.push(pathItem)

	if (this.useReferences) {
		this.typeCache.set(rawType, (cached = { path: this.path.slice() }))
	}

	// generics
	const generics: Record<string, Type> = {}
	new Set([
		...(this.utilities.getTypeGenerics(rawType) ?? []),
		...(this.utilities.getFunctionGenerics(rawType) ?? []),
	]).forEach(rawGenericType => {
		const name = String(rawGenericType.symbol?.escapedName ?? "")
		if (!name) return
		const genericType = this.createType(rawGenericType, node, {
			kind: "generic",
			name,
		})
		generics[name] = genericType
	})

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
		let target: ts.Type
		let cachedTarget

		if (
			this.useReferences &&
			(target = getTypeTarget(rawType)) != rawType &&
			(cachedTarget = this.typeCache.get(target))
		) {
			// then the type is a reference to a generic
			const typeParameters = this.utilities
				.getTypeArguments(rawType)
				?.map(rawTypeParameter => this.createType(rawTypeParameter, node))

			return {
				typeName: "Reference",
				path: cachedTarget.path,
				...(typeParameters ? { typeParameters } : {}),
			}
		} else {
			// else the type is a plain object
			type = this.creators.Object.create!({ rawType, node })!
		}
	}

	if (Object.keys(generics).length) {
		type.generics = generics
	}

	if (pathItem) this.path.pop()
	if (cached) cached.type = type

	return type
}
