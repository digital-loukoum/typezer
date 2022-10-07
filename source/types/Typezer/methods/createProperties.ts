import ts from "typescript"
import { addModifier } from "../../Modifier/addModifier.js"
import { createModifier } from "../../Modifier/createModifier.js"
import { Properties } from "../../Properties/Properties.js"
import { Typezer } from "../Typezer.js"

export function createProperties(
	this: Typezer,
	rawType: ts.Type,
	node: ts.Node
): Properties {
	const properties: Properties = {}

	rawType.getProperties().forEach(property => {
		const rawPropertyType = this.checker.getTypeOfSymbolAtLocation(property, node)
		properties[property.name] = this.createType(rawPropertyType, node)

		// optional
		if (property.flags & ts.SymbolFlags.Optional) {
			properties[property.name].optional = true
		}

		// modifiers
		property.valueDeclaration?.modifiers?.forEach(modifier => {
			const modifiers = (properties[property.name].modifiers ??= [])
			addModifier(modifiers, modifier)
		})
	})

	return properties
}
