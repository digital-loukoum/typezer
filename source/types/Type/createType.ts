import ts from "typescript"
import { getTypeNameAndId } from "../../utilities/getTypeNameAndId"
import { getOriginalBaseTypes } from "../../utilities/getOriginalBaseType"
import { createDefinition } from "../Definition/createDefinition"
import { Definition } from "../Definition/Definition"
import { findDefinition } from "../Definition/definitions"
import { Type } from "./Type"
import * as Types from "./Types"

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
		for (const TypeConstructor of Object.values(Types)) {
			// objects are used in last resort
			if (TypeConstructor == Types.ObjectType) continue

			const challenger = TypeConstructor.fromTsType(originalTsType, tsNode)
			if (challenger && TypeConstructor.priority > priority) {
				type = challenger
				priority = TypeConstructor.priority
			}
		}
	}

	// if the type could not be guessed, it's a regular object
	if (!type) {
		// console.log("tsType", tsType)
		type = Types.ObjectType.fromTsType(tsType, tsNode)
	}

	if (definition) {
		definition.type = type
		return new Types.ReferenceType(definition)
	}
	return type
}