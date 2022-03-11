import { Definition } from "./Definition"
import { DefinitionScope } from "./DefinitionScope"

export type Definitions = Record<string, Definition>

export let definitions = new DefinitionScope()

export const resetDefinitions = () => (definitions = new DefinitionScope())
