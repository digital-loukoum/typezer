import { getSchemaReference } from "../Schema/getSchemaReference"
import { Schema } from "../Schema/Schema"
import { Type } from "./Type"
import { TypeName } from "./TypeName"
import { Types } from "./Types"

export type Walker = (type: Type) => any

export const walk = (schema: Schema, callback: (type: Type) => any, root: Type) => {
	const walker = walkers(schema, (type: Type) => {
		callback(type)
		if (type.generics) Object.values(type.generics).forEach(_walk)
		_walk(type)
	})
	const _walk = (type: Type) => (walker[type.typeName] as Walker)?.(type)
	_walk(root)
}

export const walkers: (
	schema: Schema,
	walk: (type: Type) => any
) => {
	[Key in TypeName]?: (type: Types[Key]) => any
} = (schema, walk) => ({
	Object: type => Object.values(type.properties).forEach(walk),
	Class: type => Object.values(type.properties).forEach(walk),
	Namespace: type => Object.values(type.properties).forEach(walk),
	Record: type => (walk(type.keys), walk(type.items)),
	Map: type => (walk(type.keys), walk(type.items)),
	Promise: type => walk(type.item),
	Array: type => walk(type.items),
	Set: type => walk(type.items),
	Tuple: type => type.items.forEach(walk),
	Union: type => type.items.forEach(walk),
	Enumeration: type => Object.values(type.items).forEach(walk),
	Function: type => {
		type.signatures.forEach(({ parameters, returnType, restParameters }) => {
			parameters.forEach(walk)
			walk(returnType)
			if (restParameters) walk(restParameters)
		})
	},
	// Reference: type => walk(getSchemaReference(schema, type.path)),
})
