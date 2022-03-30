import { Type } from "./Type"
import { TypeName } from "./TypeName"
import { Types } from "./Types"

type Finder = (type: Type, pathItem: string) => Type | undefined

export function findPathTarget(type: Type, path: Array<string>): Type | undefined {
	const finder = finders[type.typeName] as Finder
	if (!finder) return undefined
	const target = finder(type, path[0])
	return target && findPathTarget(target, path.slice(1))
}

const finders: {
	[Key in TypeName]?: (type: Types[Key], pathItem: string) => Type | undefined
} = {
	Object: (type, pathItem) => type.properties[pathItem],
	Record: type => type.items,
	Array: type => type.items,
	Set: type => type.items,
	Map: type => type.items,
	Enumeration: (type, pathItem) => type.items[pathItem],
	Class: (type, pathItem) => type.properties[pathItem],
	Namespace: (type, pathItem) => type.properties[pathItem],
	Tuple: (type, pathItem) => type.items[+pathItem],
}
