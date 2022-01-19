import ts from "typescript"
import { getTypeNameAndId } from "../../utilities/getNameId"
import { createType } from "../Type/createType"
import { ResolvingType } from "../Type/Types"
import type { Definition } from "./Definition"
import { definitions } from "./definitions"
import { getDefinitionNameId } from "./getDefinitionNameId"

export function createDefinition(name: string, id: number): Definition | null {
	const nameId = getDefinitionNameId(name, id)

	if (!(nameId in definitions)) {
		definitions[nameId] = { id, name, type: new ResolvingType(id) }
	}

	return definitions[nameId]
}
