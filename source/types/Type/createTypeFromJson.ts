import { createTypeFromPlainObject } from "./createTypeFromPlainObject"
import { Type } from "./Type"

export function createTypeFromJson(json: string): Type | undefined {
	return createTypeFromPlainObject(JSON.parse(json))
}
