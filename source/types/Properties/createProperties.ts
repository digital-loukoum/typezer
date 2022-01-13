import ts from "typescript"
import { getTypeOfSymbol } from "../../utilities/getTypeOfSymbol"
import { createType } from "../Type/createType"
import { Properties } from "./Properties"

export function createProperties(tsType: ts.Type, tsNode: ts.Node) {
	const properties: Properties = {}

	tsType.getProperties().forEach(tsProperty => {
		const tsType = getTypeOfSymbol(tsProperty, tsNode)
		properties[tsProperty.name] = createType(tsType, tsNode)

		// optional
		if (tsProperty.flags & ts.SymbolFlags.Optional) {
			properties[tsProperty.name].optional = true
		}

		// modifiers
		tsProperty.valueDeclaration?.modifiers?.forEach(modifier => {
			properties[tsProperty.name].addModifier(modifier)
		})
	})

	return properties
}
