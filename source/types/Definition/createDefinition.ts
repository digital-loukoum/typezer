import { ResolvingType } from "../Type/Types"
import type { Definition } from "./Definition"
import { definitions } from "./definitions"

export function createGlobalDefinition(name: string, id: number): Definition {
	let definition = definitions.findDefinition(id)

	if (!definition) {
		definition = { id, name, type: new ResolvingType(id) }
		if (name in definitions) {
			let alias = 2
			while (`name$${alias}` in definitions) alias++
			name = `name$${alias}`
		}
		definitions.global[name] = definition
	}

	return definition
}

export function createLocalDefinition(name: string, id: number): Definition {
	let definition = definitions.findDefinition(id)

	if (!definition) {
		definition = { id, name, type: new ResolvingType(id) }
		if (name in definitions) {
			let alias = 2
			while (`name$${alias}` in definitions) alias++
			name = `name$${alias}`
		}
		definitions.local[name] = definition
	}

	return definition
}
