import { Definition } from "./Definition"

export let definitions: Record<string, Definition> = {}

export const resetDefinitions = () => (definitions = {})
