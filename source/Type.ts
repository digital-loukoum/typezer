import ts from "typescript"
import { propertyConstructors, Property, Properties } from "./properties"
import { BaseProperty } from "./properties/BaseProperty"
import { ObjectProperty } from "./properties/definitions"
import { getTypeChecker } from "./typeChecker"
import { getOriginalBaseTypes } from "./typeChecker/getOriginalBaseType"
import { typeToString } from "./typeChecker/typeToString"

export type TypeNodeDeclaration =
	| ts.TypeAliasDeclaration
	| ts.ClassDeclaration
	| ts.InterfaceDeclaration

export class Type {
	constructor(public type: ts.Type, public node: ts.Node) {}

	static fromNode(node: ts.Node): Type {
		const type = new Type(getTypeChecker().getTypeAtLocation(node), node)
		type.node = node
		return type
	}

	// dictionary of types by id
	static readonly types = new Map<number, Type>()

	toProperty(): Property {
		const originalBaseTypes = getOriginalBaseTypes(this.type)
		let priority = -Infinity
		let property: Property | undefined = undefined
		console.log(typeToString(this.type), (this.type as any).id)

		for (const originalType of originalBaseTypes) {
			for (const propertyConstructor of Object.values(propertyConstructors)) {
				// objects are used in last resort
				if (propertyConstructor == ObjectProperty) continue

				const newProperty = propertyConstructor.fromType(
					new Type(originalType, this.node)
				)
				if (newProperty && propertyConstructor.priority > priority) {
					property = newProperty
					priority = propertyConstructor.priority
				}
			}
		}

		// if the property could not be guessed, it's a generic object
		if (!property) return ObjectProperty.fromType(this)
		return property
	}

	getProperties(): Properties {
		// const cached = Type.propertiesCache.get(this.type)
		// if (cached) return cached

		const properties: Properties = {}

		this.type.getProperties().forEach(property => {
			// console.log(`[${property.name}]`)
			// console.log("property", property)
			const propertyType = this.getTypeOfSymbol(property)
			properties[property.name] = propertyType.toProperty()

			// optional
			if (property.flags & ts.SymbolFlags.Optional) {
				properties[property.name].optional = true
			}

			// modifiers
			property.valueDeclaration?.modifiers?.forEach(modifier => {
				properties[property.name].addModifier(modifier)
			})
		})

		// Type.propertiesCache.set(this.type, properties)
		return properties
	}

	getTypeOfSymbol(symbol: ts.Symbol): Type {
		return new Type(
			getTypeChecker().getTypeOfSymbolAtLocation(symbol, this.node),
			this.node
		)
	}
}
