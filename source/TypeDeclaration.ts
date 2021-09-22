import ts from "typescript"
import { Organism } from "./property/Organism"

export type TypeDeclarationNode =
	| ts.TypeAliasDeclaration
	| ts.ClassDeclaration
	| ts.InterfaceDeclaration

export class TypeDeclaration {
	readonly type: ts.Type

	constructor(private typeChecker: ts.TypeChecker, public node: TypeDeclarationNode) {
		this.type = this.typeChecker.getTypeAtLocation(node)
	}

	get name(): string {
		return this.node.name?.escapedText.toString() || "[NO NAME]"
	}

	toProperty(): Organism {
		if (this.type.isLiteral()) {
			if (this.type.isNumberLiteral()) return "Number"
			if (this.type.isStringLiteral()) return "String"
		}
		return "Any"
	}

	getProperties(): Record<string, any> {
		const properties: Record<string, any> = {}

		for (const property of this.type.getProperties()) {
			const propertyType = this.typeChecker.getTypeOfSymbolAtLocation(property, this.node)
			const name = property.name
			const type = this.typeChecker.typeToString(propertyType)
			const subProperties = propertyType
				.getProperties()
				.map(property => property.escapedName)
			properties[name] = [type, propertyType.isLiteral()]
		}
		return properties
	}
}
