import ts from "typescript"
import { getDeclarationNodes } from "../../utilities/getDeclarationNodes"
import { createDeclaration } from "../Declaration/createDeclaration"
import { Declaration } from "../Declaration/Declaration"

export class SourceFile {
	constructor(public tsSourceFile: ts.SourceFile) {}

	get name(): string {
		return this.tsSourceFile.fileName
	}

	getDeclarations(parent: ts.Node = this.tsSourceFile): Declaration[] {
		const declarations: Declaration[] = []
		parent.forEachChild(node => {
			const declarationNodes = getDeclarationNodes(node)
			declarationNodes.forEach(node => {
				declarations.push(createDeclaration(this.name, node))
			})
		})

		return declarations
	}
}
