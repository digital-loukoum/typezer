import ts from "typescript"
import { getTypeNameAndId } from "../../utilities/getTypeNameAndId"
import { getOriginalBaseTypes } from "../../utilities/getOriginalBaseType"
import { createDefinition } from "../Definition/createDefinition"
import { Definition } from "../Definition/Definition"
import { findDefinition } from "../Definition/definitions"
import { Type } from "./Type"
import * as Types from "./Types"

const typeConstructors = Object.values(Types)
const lowPriorityTypes: Array<typeof typeConstructors[number]> = [
	Types.RecordType,
	Types.ObjectType,
]

export function createType(tsType: ts.Type, tsNode: ts.Node, name?: string): Type {
	let definition: Definition | undefined = undefined
	const nameAndId = getTypeNameAndId(tsType)
	const { id } = nameAndId
	name ??= nameAndId.name

	if (name) {
		definition = findDefinition(id)
		if (definition) {
			// definition already resolved
			return new Types.ReferenceType(definition)
		} else definition = createDefinition(name, id)
	}

	const originalBaseTsTypes = getOriginalBaseTypes(tsType)
	let priority = -Infinity
	let type: Type | undefined = undefined

	for (const originalTsType of originalBaseTsTypes) {
		for (const TypeConstructor of typeConstructors) {
			// objects are used in last resort
			if (lowPriorityTypes.includes(TypeConstructor)) continue

			const challenger = TypeConstructor.fromTsType(originalTsType, tsNode)
			if (challenger && TypeConstructor.priority > priority) {
				type = challenger
				priority = TypeConstructor.priority
			}
		}
	}

	// if the type could not be guessed, it's a regular object
	if (!type) {
		for (const TypeConstructor of lowPriorityTypes) {
			type = TypeConstructor.fromTsType(tsType, tsNode)
			if (type) break
		}
	}

	if (definition) {
		definition.type = type!
		return new Types.ReferenceType(definition)
	}
	return type!
}
