import { Path } from "../Path/Path"
import { PathItem } from "../Path/PathItem"
import { Type } from "./Type"
import { TypeName } from "./TypeName"
import { Types } from "./Types"

export function getPathTarget(type: Type, path: Path) {
	if (!path.length) return type
	const getter = pathTargetByType[type.typeName]
	if (getter) {
		const [pathItem] = path
		return getter(type as any, pathItem, path.slice(1))
	}
	throw new Error(`Cannot reach path ${path}`)
}

export const pathTargetByType: {
	[Key in TypeName]?: (type: Types[Key], pathItem: PathItem, path: Path) => Type
} = {
	Object: (type, pathItem, path) => {
		if (pathItem.kind != "property") throw badPathItemKind(pathItem, "property")
		if (pathItem.name in type.properties) {
			return getPathTarget(type.properties[pathItem.name], path)
		}
		throw new Error(`Property ${pathItem.name} missing in object ${type.properties}`)
	},
	Tuple: (type, pathItem, path) => {
		if (pathItem.kind != "tupleItem") throw badPathItemKind(pathItem, "tupleItem")
		if (pathItem.index >= 0 && pathItem.index < type.items.length) {
			return getPathTarget(type.items[pathItem.index], path.slice(1))
		}
		throw new Error(
			`Index ${pathItem.index} is not in tuple range of length ${type.items.length}`
		)
	},
	Array: (type, pathItem, path) => {
		if (pathItem.kind != "items") throw badPathItemKind(pathItem, "items")
		return getPathTarget(type.items, path)
	},
	Set: (type, pathItem, path) => {
		if (pathItem.kind != "items") throw badPathItemKind(pathItem, "items")
		return getPathTarget(type.items, path)
	},
	Record: (type, pathItem, path) => {
		if (pathItem.kind != "items") throw badPathItemKind(pathItem, "items")
		return getPathTarget(type.items, path)
	},
	Map: (type, pathItem, path) => {
		if (pathItem.kind == "keys") return getPathTarget(type.keys, path)
		if (pathItem.kind == "items") return getPathTarget(type.items, path)
		throw new Error(
			`Expecting a path item of kind 'keys' | 'items' but received '${JSON.stringify(
				pathItem.kind
			)}'`
		)
	},
}

export function badPathItemKind(pathItem: PathItem, expected: PathItem["kind"]): string {
	return `Expecting a path item of kind '${expected}' but received '${JSON.stringify(
		pathItem.kind
	)}'`
}
