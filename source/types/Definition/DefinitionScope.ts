import { Definitions } from "./definitions"
import { Type } from "../Type/Type"
import { Definition } from "./Definition"

export class DefinitionScope {
	protected scope: Definitions[] = [{}]

	get global() {
		return this.scope[0]
	}

	get local() {
		return this.scope[this.scope.length - 1]
	}

	// add a new definition to the global scope
	add() {}

	push(...definitions: Definitions[]) {
		this.scope.push(...definitions)
	}

	pop() {
		this.scope.pop()
	}

	findType(typeId: number): Type | undefined {
		return this.findDefinition(typeId)?.type
	}

	findDefinition(typeId: number): Definition | undefined {
		for (const definitions of this.scope) {
			for (const name in definitions) {
				if (definitions[name].id == typeId) return definitions[name]
			}
		}
	}

	findDefinitionName(id: number): string | undefined {
		for (const definitions of this.scope) {
			for (const name in definitions) {
				if (definitions[name].id == id) return name
			}
		}
	}
}
