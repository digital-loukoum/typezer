import ts from "typescript"
import {
	Property,
	Properties,
	ArrayProperty,
	MapProperty,
	ObjectProperty,
	SetProperty,
	AnyProperty,
	StringProperty,
	NumberProperty,
	BooleanProperty,
	BigIntegerProperty,
	UnknownProperty,
	TupleProperty,
	RecordProperty,
} from "./Property"
import { getTypeChecker } from "./typeChecker"

export type TypeNodeDeclaration =
	| ts.TypeAliasDeclaration
	| ts.ClassDeclaration
	| ts.InterfaceDeclaration

export class Type {
	public type: ts.Type
	public node?: ts.Node

	constructor(type: ts.Type) {
		this.type = type
	}

	static fromNode(node: ts.Node) {
		const type = new Type(getTypeChecker().getTypeAtLocation(node))
		type.node = node
		return type
	}

	toProperty(): Property {
		// console.log("toProperty:", this.type)
		console.log(`type.flags`, this.type.flags)
		console.log(`this.type.getSymbol()?.name`, this.type.getSymbol()?.name)
		console.log(`this.type.getSymbol()?.flags`, this.type.getSymbol()?.flags)
		// console.log(
		// 	`typeArguments`,
		// 	getTypeChecker()
		// 		.getTypeArguments(this.type as ts.TypeReference)
		// 		.map(subtype => new Type(subtype).toProperty())
		// )
		const { flags } = this.type

		if (flags & ts.TypeFlags.Any) return new AnyProperty()
		if (flags & ts.TypeFlags.Unknown) return new AnyProperty()
		if (flags & ts.TypeFlags.StringLike) return new StringProperty()
		if (flags & ts.TypeFlags.NumberLike) return new NumberProperty()
		if (flags & ts.TypeFlags.BooleanLike) return new BooleanProperty()
		if (flags & ts.TypeFlags.BigIntLike) return new BigIntegerProperty()

		// if (flags & ts.TypeFlags.Enum) return new EnumProperty()

		// TODO: catch the error
		if (flags & ts.TypeFlags.Null) throw new Error(`Property always null`)
		if (flags & ts.TypeFlags.Undefined) throw new Error(`Property always undefined`)
		if (flags & ts.TypeFlags.Never) throw new Error(`Property of type 'never'`)

		// const symbol = this.type.getSymbol()
		// if (symbol?.name == "Array") {
		// 	const [subType] = getTypeChecker().getTypeArguments(this.type as ts.TypeReference)
		// 	return new ArrayProperty(new Type(subType).toProperty())
		// }
		// if (symbol?.name == "Set") {
		// 	const [subType] = getTypeChecker().getTypeArguments(this.type as ts.TypeReference)
		// 	return new SetProperty(new Type(subType).toProperty())
		// }
		// if (symbol?.name == "Map") {
		// 	const [keyType, valueType] = getTypeChecker().getTypeArguments(
		// 		this.type as ts.TypeReference
		// 	)
		// 	return new MapProperty(
		// 		new Type(keyType).toProperty(),
		// 		new Type(valueType).toProperty()
		// 	)
		// }

		// if (this.isTuple()) {
		// 	return new TupleProperty(
		// 		getTypeChecker()
		// 			.getTypeArguments(this.type as ts.TypeReference)
		// 			.map(subtype => new Type(subtype).toProperty())
		// 	)
		// }
		// console.log("Is not tuple...")

		// if (this.isRecord()) {
		// 	console.log("IS RECORD!")
		// 	const [keyType, valueType] = this.type.aliasTypeArguments || []
		// 	return new RecordProperty(new Type(valueType).toProperty())
		// 	// console.log(this.type.aliasTypeArguments)
		// }
		// console.log("Is not record...")

		// if (this.type.aliasTypeArguments) {
		// console.log(`-- aliasTypeArguments`, this.type.aliasTypeArguments)
		// }

		// if (this.type.isIntersection()) {
		// 	console.log("IS INTERSECTION")
		// 	const properties: Properties = {}
		// 	this.type.types.forEach(type =>
		// 		Object.assign(properties, new Type(type).getProperties())
		// 	)
		// 	return new ObjectProperty(properties)
		// }

		if (flags & ts.TypeFlags.Object) {
			const objectType = this.type as ts.ObjectType

			console.log(`objectType.flags`, objectType.objectFlags)
			return new ObjectProperty(this.getProperties())
		}

		return new UnknownProperty()
	}

	static propertiesCache = new Map<ts.Type, Properties>()
	getProperties(): Properties {
		const cached = Type.propertiesCache.get(this.type)
		if (cached) return cached

		const properties: Properties = {}

		this.type.getProperties().forEach((property, index) => {
			const propertyType = this.getTypeOfSymbol(property)
			// const type = new Type(declaration)
			// console.log(getTypeChecker().typeToString(propertyType))
			properties[property.name] = propertyType.toProperty()
		})

		Type.propertiesCache.set(this.type, properties)
		return properties
	}

	private getTypeOfSymbol(symbol: ts.Symbol): Type {
		console.log(`GETTING TYPE OF SYMBOL ${symbol.getName()}!!!!`)
		let node = this.node
		if (!node) {
			const declarations = symbol.getDeclarations()
			if (!declarations) throw `No declarations for symbol ${symbol.getName()}`
			node = declarations[declarations.length - 1]
		}
		const type = new Type(getTypeChecker().getTypeOfSymbolAtLocation(symbol, node))
		return type
	}

	private isArray(): boolean {
		return false
	}

	private isFunction(): boolean {
		return false
	}

	private isObject(): boolean {
		return false
	}

	private isRecord(): boolean {
		return false
	}

	private isMap(): boolean {
		return false
	}

	private isSet(): boolean {
		return false
	}

	private isDate(): boolean {
		return false
	}

	private isTuple(): boolean {
		return false
	}

	// private isTuple(): boolean {
	// 	if (!(this.type.flags & ts.TypeFlags.Object)) return false
	// 	const objectType = this.type as ts.ObjectType

	// 	if (objectType.objectFlags & ts.ObjectFlags.Reference) {
	// 		const referenceType = this.type as ts.TypeReference
	// 		return new Type(referenceType.target).isTuple()
	// 	}

	// 	return !!(objectType.objectFlags & ts.ObjectFlags.Tuple)
	// }

	// private isRecord(): boolean {
	// 	if (!(this.type.flags & ts.TypeFlags.Object)) return false
	// 	const symbol = this.type.getSymbol()
	// 	if (!symbol) return false
	// 	if (!(symbol.flags & ts.SymbolFlags.TypeLiteral)) return false

	// 	const objectType = this.type as ts.ObjectType
	// 	return !!(objectType.objectFlags & ts.ObjectFlags.Mapped)
	// }

	// getProperties(): Record<string, any> {
	// 	const properties: Record<string, any> = {}

	// 	for (const property of this.type.getProperties()) {
	// 		const   = getTypeChecker().getTypeOfSymbolAtLocation(property, this.node)
	// 		const name = property.name
	// 		const type = getTypeChecker().typeToString(propertyType)
	// 		const subProperties = propertyType
	// 			.getProperties()
	// 			.map(property => property.escapedName)
	// 		properties[name] = [type, propertyType.isLiteral()]
	// 	}
	// 	return properties
	// }
}
