import { RawDeclaration } from "../../Declaration/RawDeclaration"
import { Typezer } from "../Typezer"

const duplicate = (value: string, index: number) => `${value}$${index}`

export function createRawDeclaration(
	this: Typezer,
	declaration: Omit<RawDeclaration, "id" | "rawType">
): RawDeclaration {
	let id = declaration.name

	// we find a unique id
	if (this.rawDeclarations.find(rawDeclaration => rawDeclaration.id == id)) {
		let index = 2
		do {
			id = duplicate(declaration.name, index++)
		} while (this.rawDeclarations.find(rawDeclaration => rawDeclaration.id == id))
	}

	return {
		id,
		...declaration,
		rawType: this.checker.getTypeAtLocation(declaration.node),
	}
}
