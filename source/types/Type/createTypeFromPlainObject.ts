import { Type } from "./Type"
import * as Types from "./Types"

export type PlainTypeObject = { type: string }

export function createTypeFromPlainObject(object: PlainTypeObject): Type {
	for (const Type of Object.values(Types)) {
		if (Type.type == object.type) {
			return Type.fromPlainObject(object as any)
		}
	}
	throw new Error(`Could not create Type from plain object: ${JSON.stringify(object)}`)
}
