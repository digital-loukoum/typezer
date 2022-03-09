import { ResolvingType } from "../Type/Types"
import type { Definition } from "./Definition"
import { definitions, findDefinition } from "./definitions"

export function createDefinition(name: string, id: number): Definition {
	let definition = findDefinition(id)

	if (!definition) {
		definition = { id, name, type: new ResolvingType(id) }
		if (name in definitions) {
			let alias = 2
			while (`name$${alias}` in definitions) alias++
			name = `name$${alias}`
		}
		definitions[name] = definition
	}

	return definition
}
