import { Path } from "../Path/Path"
import { PathItem } from "../Path/PathItem"
import { Type } from "./Type"
import { TypeName } from "./TypeName"
import { Types } from "./Types"

export function getPathTarget(type: Type, path: Path): Type {
	if (!path.length) return type
	const [pathItem] = path
	let targetType: Type

	if (pathItem.kind == "generic") {
		if (!type.generics || !(pathItem.name in type.generics)) {
			throw new Error(
				`Generic '${pathItem.name}' not found in ${JSON.stringify(type.generics)}`
			)
		}
		targetType = type.generics[pathItem.name]
	} else {
		const getter = pathTargetByType[type.typeName]
		if (!getter) throw new Error(`Cannot find path getter for type ${type.typeName}`)
		targetType = getter(type as any, pathItem)
	}

	return getPathTarget(targetType, path.slice(1))
}

export const pathTargetByType: {
	[Key in TypeName]?: (type: Types[Key], pathItem: PathItem) => Type
} = {
	Object: (type, pathItem) => {
		if (pathItem.kind != "property") throw badPathItemKind(pathItem, "property")
		if (pathItem.name in type.properties) {
			return type.properties[pathItem.name]
		}
		throw new Error(`Property ${pathItem.name} missing in object ${type.properties}`)
	},
	Promise: (type, pathItem) => {
		if (pathItem.kind != "item") throw badPathItemKind(pathItem, "item")
		return type.item
	},
	Tuple: (type, pathItem) => {
		if (pathItem.kind != "tupleItem") throw badPathItemKind(pathItem, "tupleItem")
		if (pathItem.index >= 0 && pathItem.index < type.items.length) {
			return type.items[pathItem.index]
		}
		throw new Error(
			`Index ${pathItem.index} is not in tuple range of length ${type.items.length}`
		)
	},
	Array: (type, pathItem) => {
		if (pathItem.kind != "items") throw badPathItemKind(pathItem, "items")
		return type.items
	},
	Set: (type, pathItem) => {
		if (pathItem.kind != "items") throw badPathItemKind(pathItem, "items")
		return type.items
	},
	Record: (type, pathItem) => {
		if (pathItem.kind != "items") throw badPathItemKind(pathItem, "items")
		return type.items
	},
	Map: (type, pathItem) => {
		if (pathItem.kind == "keys") return type.keys
		if (pathItem.kind == "items") return type.items
		throw new Error(
			`Expecting a path item of kind 'keys' | 'items' but received '${pathItem.kind}'`
		)
	},
}

export function badPathItemKind(pathItem: PathItem, expected: PathItem["kind"]): string {
	return `Expecting a path item of kind '${expected}' but received '${pathItem.kind}'`
}
