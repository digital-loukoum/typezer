import { RawDeclaration } from "../../Declaration/RawDeclaration"
import { Typezer } from "../Typezer"

const duplicate = (value: string, index: number) => `${value}$${index}`

export function createDeclaration(
	this: Typezer,
	declaration: Omit<RawDeclaration, "id" | "type">
): RawDeclaration {
	let id = declaration.name

	// we find a unique id
	if (this.scope.findById(id)) {
		let index = 2
		do {
			id = duplicate(declaration.name, index++)
		} while (this.scope.findById(id))
	}
	return {
		id,
		...declaration,
		type: this.checker.getTypeAtLocation(declaration.node),
	}
}
