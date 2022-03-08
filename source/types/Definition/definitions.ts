import { Definition } from "./Definition"

export type Definitions = Record<string, Definition>

export let definitions: Definitions = {}

export const resetDefinitions = () => (definitions = {})

export const findDefinition = (id: number): Definition | undefined => {
	return Object.values(definitions).find(definition => definition.id == id)
}

export const findDefinitionReference = (id: number): string => {
	for (const reference in definitions) {
		if (definitions[reference].id == id) return reference
	}
	throw new Error(`Could not find definition with id ${id}`)
}
