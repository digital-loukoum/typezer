import ts from "typescript"
import { propertyConstructors, Property, Properties } from "./properties"
import { BaseProperty } from "./properties/BaseProperty"
import { getTypeChecker } from "./typeChecker"
import { getOriginalBaseTypes } from "./typeChecker/getOriginalBaseType"

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

	toProperty(): Property {
		const originalBaseTypes = getOriginalBaseTypes(this.type)
		let priority = Infinity
		let property: Property | undefined = undefined

		for (const originalType of originalBaseTypes) {
			for (const propertyConstructor of Object.values(propertyConstructors)) {
				// console.log("Checking", propertyConstructor.name, "...")
				const newProperty = propertyConstructor.fromType(
					new Type(originalType, this.node)
				)
				if (newProperty && propertyConstructor.priority < priority) {
					property = newProperty
					priority = propertyConstructor.priority
				}
			}
		}

		if (!property) throw new Error("Could not find type of property")
		return property

		// if (this.isRecord()) {
		// 	console.log("IS RECORD!")
		// 	const [keyType, valueType] = this.type.aliasTypeArguments || []
		// 	return new RecordProperty(new Type(valueType).toProperty())
		// 	// console.log(this.type.aliasTypeArguments)
		// }
		// console.log("Is not record...")

		// if (this.type.isIntersection()) {
		// 	console.log("IS INTERSECTION")
		// 	const properties: Properties = {}
		// 	this.type.types.forEach(type =>
		// 		Object.assign(properties, new Type(type).getProperties())
		// 	)
		// 	return new ObjectProperty(properties)
		// }
	}

	static propertiesCache = new Map<ts.Type, Properties>()

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
