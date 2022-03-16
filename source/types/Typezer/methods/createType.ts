import ts from "typescript"
import { Typezer } from "../Typezer"
import { getOriginalBaseTypes } from "../../../utilities/getOriginalBaseType"
import { Type } from "../../Type/Type"
import { TypeName } from "../../Type/TypeName"
import { PathItem } from "../../Path/PathItem"
import { isPrimitive } from "../../Type/isPrimitive"
import { getTypeTarget } from "../../../utilities/getTypeTarget"

export function createType(
	this: Typezer,
	rawType: ts.Type,
	node: ts.Node,
	pathItem?: PathItem
): Type {
	const target = getTypeTarget(rawType)
	let initialType: ts.Type | undefined = undefined
	let typeParameters: Type[] | undefined = undefined

	if (target && target != rawType) {
		initialType = rawType
		console.log("Initial type:", initialType)
		typeParameters = this.checker
			.getTypeArguments(rawType as ts.TypeReference)
			?.map(rawTypeParameter => this.createType(rawTypeParameter, node))
		rawType = target
	}

	// we check if the type has not been already cached
	let cached = this.typeCache.get(rawType)
	if (cached) {
		if (cached.type && isPrimitive(cached.type)) return { ...cached.type }
		return {
			typeName: "Reference",
			path: cached.path,
			...(typeParameters ? { typeParameters } : {}),
		}
	}

	console.log("rawType", rawType.symbol?.escapedName, rawType)
	// return
	if (pathItem) this.path.push(pathItem)
	this.typeCache.set(rawType, (cached = { path: this.path.slice() }))

	// generics
	const generics: Record<string, Type> = {}
	new Set([
		...(this.checker.getTypeArguments(rawType as ts.TypeReference) ?? []), // type generics
		...(this.utilities.getFunctionGenerics(rawType) ?? []), // function generics
	]).forEach(rawGenericType => {
		const name = String(rawGenericType.symbol?.escapedName ?? "")
		const genericType = this.createType(rawGenericType, node, {
			kind: "generic",
			name,
		})
		generics[name] = genericType
	})

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

			const challenger = constructor.create?.({
				rawType: baseRawType,
				initialType,
				node,
				typeParameters,
			})
			if (challenger && (constructor.priority ?? 0) > priority) {
				;(type = challenger), (priority = constructor.priority ?? 0)
			}
		}
	}

	// if the type could not be guessed, it's a regular object
	if (!type) type = this.types.Object.create!({ rawType, node, typeParameters })!

	if (Object.keys(generics).length) {
		type.generics = generics
	}

	if (pathItem) this.path.pop()
	return (cached.type = type)
}
