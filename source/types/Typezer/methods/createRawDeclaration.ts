import { RawDeclaration } from "../../Declaration/RawDeclaration.js"
import { Typezer } from "../Typezer.js"

const duplicate = (value: string, index: number) => `${value}$${index}`

export function createRawDeclaration(
	this: Typezer,
	declaration: Omit<RawDeclaration, "id" | "rawType">
): RawDeclaration {
	let id = declaration.name
	let typeNode = declaration.node

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
		rawType: this.checker.getTypeAtLocation(typeNode),
	}
}
