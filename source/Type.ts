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

export type TypeNodeDeclaration =
	| ts.TypeAliasDeclaration
	| ts.ClassDeclaration
	| ts.InterfaceDeclaration

export class Type {
	constructor(private typeChecker: ts.TypeChecker, public type: ts.Type) {}

	static fromNode(typeChecker: ts.TypeChecker, node: ts.Node): Type {
		return new Type(typeChecker, typeChecker.getTypeAtLocation(node))
	}

	// get name(): string {
	// 	return this.node.name?.escapedText.toString() || "[NO NAME]"
	// }

	toProperty(): Property {
		// console.log("toProperty:", this.type)
		console.log(`type.flags`, this.type.flags)
		console.log(`this.type.getSymbol()?.name`, this.type.getSymbol()?.name)
		console.log(`this.type.getSymbol()?.flags`, this.type.getSymbol()?.flags)
		// console.log(
		// 	`typeArguments`,
		// 	this.typeChecker
		// 		.getTypeArguments(this.type as ts.TypeReference)
		// 		.map(subtype => new Type(this.typeChecker, subtype).toProperty())
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

		const symbol = this.type.getSymbol()
		if (symbol?.name == "Array") {
			const [subType] = this.typeChecker.getTypeArguments(this.type as ts.TypeReference)
			return new ArrayProperty(new Type(this.typeChecker, subType).toProperty())
		}
		if (symbol?.name == "Set") {
			const [subType] = this.typeChecker.getTypeArguments(this.type as ts.TypeReference)
			return new SetProperty(new Type(this.typeChecker, subType).toProperty())
		}
		if (symbol?.name == "Map") {
			const [keyType, valueType] = this.typeChecker.getTypeArguments(
				this.type as ts.TypeReference
			)
			return new MapProperty(
				new Type(this.typeChecker, keyType).toProperty(),
				new Type(this.typeChecker, valueType).toProperty()
			)
		}

		if (this.isTuple()) {
			return new TupleProperty(
				this.typeChecker
					.getTypeArguments(this.type as ts.TypeReference)
					.map(subtype => new Type(this.typeChecker, subtype).toProperty())
			)
		}
		console.log("Is not tuple...")

		// if (this.isRecord()) {
		// 	console.log("IS RECORD!")
		// 	const [keyType, valueType] = this.type.aliasTypeArguments || []
		// 	return new RecordProperty(new Type(this.typeChecker, valueType).toProperty())
		// 	// console.log(this.type.aliasTypeArguments)
		// }
		// console.log("Is not record...")

		if (this.type.aliasTypeArguments) {
			// console.log(`-- aliasTypeArguments`, this.type.aliasTypeArguments)
		}

		if (this.type.isIntersection()) {
			console.log("IS INTERSECTION")
			const properties: Properties = {}
			this.type.types.forEach(type =>
				Object.assign(properties, new Type(this.typeChecker, type).getProperties())
			)
			return new ObjectProperty(properties)
		}

		if (flags & ts.TypeFlags.Object) {
			const objectType = this.type as ts.ObjectType

			console.log(`objectType.flags`, objectType.objectFlags)
			return new ObjectProperty(this.getProperties())
		}

		return new UnknownProperty()
	}

	getProperties(): Properties {
		const properties: Properties = {}

		this.type.getProperties().forEach((property, index) => {
			console.log("property.getDeclarations().length", property.getDeclarations()?.length)
			const [declaration] = property.getDeclarations() ?? []
			if (!declaration) {
				throw new Error(`No declaration found for property '${property.name}'`) // should not happen
			}
			const type = new Type(
				this.typeChecker,
				this.typeChecker.getTypeAtLocation(declaration)
			)

			properties[property.name] = type.toProperty()
		})

		return properties
	}

	private isTuple(): boolean {
		if (!(this.type.flags & ts.TypeFlags.Object)) return false
		const objectType = this.type as ts.ObjectType

		if (objectType.objectFlags & ts.ObjectFlags.Reference) {
			const referenceType = this.type as ts.TypeReference
			return new Type(this.typeChecker, referenceType.target).isTuple()
		}

		return !!(objectType.objectFlags & ts.ObjectFlags.Tuple)
	}

	private isRecord(): boolean {
		if (!(this.type.flags & ts.TypeFlags.Object)) return false
		const symbol = this.type.getSymbol()
		if (!symbol) return false
		if (!(symbol.flags & ts.SymbolFlags.TypeLiteral)) return false

		const objectType = this.type as ts.ObjectType
		return !!(objectType.objectFlags & ts.ObjectFlags.Mapped)
	}

	// getProperties(): Record<string, any> {
	// 	const properties: Record<string, any> = {}

	// 	for (const property of this.type.getProperties()) {
	// 		const   = this.typeChecker.getTypeOfSymbolAtLocation(property, this.node)
	// 		const name = property.name
	// 		const type = this.typeChecker.typeToString(propertyType)
	// 		const subProperties = propertyType
	// 			.getProperties()
	// 			.map(property => property.escapedName)
	// 		properties[name] = [type, propertyType.isLiteral()]
	// 	}
	// 	return properties
	// }
}
