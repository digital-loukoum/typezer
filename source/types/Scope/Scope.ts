import { getTypeId } from "../../utilities/getTypeId"
import { RawDeclaration } from "../Declaration/RawDeclaration"

export class Scope {
	protected scope: RawDeclaration[][]

	constructor(declarations: RawDeclaration[]) {
		this.scope = [declarations]
	}

	get global() {
		return this.scope[0]
	}
	set global(value: RawDeclaration[]) {
		this.scope[0] = value
	}

	get local() {
		return this.scope[this.scope.length - 1]
	}
	set local(value: RawDeclaration[]) {
		this.scope[this.scope.length - 1] = value
	}

	push(...declarations: RawDeclaration[][]) {
		this.scope.push(...declarations)
	}

	pop() {
		this.scope.pop()
	}

	findById(id: string): RawDeclaration | undefined {
		return this.find(declaration => declaration.id == id)
	}

	findByTypeId(typeId: number): RawDeclaration | undefined {
		return this.find(declaration => getTypeId(declaration.type) == typeId)
	}

	find(finder: (declaration: RawDeclaration) => unknown): RawDeclaration | undefined {
		for (let index = this.scope.length - 1; index >= 0; index--) {
			const declarations = this.scope[index]
			for (const declaration of declarations) {
				if (finder(declaration)) return declaration
			}
		}
	}
}
