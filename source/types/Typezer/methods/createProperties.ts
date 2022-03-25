import ts from "typescript"
import { createModifier } from "../../Modifier/createModifier"
import { Properties } from "../../Properties/Properties"
import { Typezer } from "../Typezer"

export function createProperties(
	this: Typezer,
	rawType: ts.Type,
	node: ts.Node,
	{ staticProperties = true }: { staticProperties?: boolean } = {}
): Properties {
	const properties: Properties = {}

	rawType.getProperties().forEach(property => {
		const rawPropertyType = this.checker.getTypeOfSymbolAtLocation(property, node)
		properties[property.name] = this.createType(rawPropertyType, node, {
			kind: staticProperties ? "staticProperty" : "property",
			name: property.name,
		})

		// optional
		if (property.flags & ts.SymbolFlags.Optional) {
			properties[property.name].optional = true
		}

		// modifiers
		property.valueDeclaration?.modifiers?.forEach(modifier => {
			const modifiers = (properties[property.name].modifiers ??= [])
			modifiers.push(createModifier(modifier))
		})
	})

	return properties
}
