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
	FunctionProperty,
	VoidProperty,
} from "./Property"
import {
	getArrayType,
	getTypeChecker,
	getPrimitiveType,
	someBaseType,
} from "./typeChecker"

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
		const { flags } = this.type
		// console.log("this.type", this.type)

		const primitiveType = getPrimitiveType(this.type)
		// console.log("primitiveType", primitiveType)

		if (primitiveType) {
			if (flags & ts.TypeFlags.Any) return new AnyProperty()
			if (flags & ts.TypeFlags.Void) return new VoidProperty()
			if (flags & ts.TypeFlags.Unknown) return new UnknownProperty()
			if (flags & ts.TypeFlags.StringLike) return new StringProperty()
			if (flags & ts.TypeFlags.NumberLike) return new NumberProperty()
			if (flags & ts.TypeFlags.BooleanLike) return new BooleanProperty()
			if (flags & ts.TypeFlags.BigIntLike) return new BigIntegerProperty()

			// if (flags & ts.TypeFlags.Enum) return new EnumProperty()

			// TODO: catch the error
			if (flags & ts.TypeFlags.Null) throw new Error(`Property always null`)
			if (flags & ts.TypeFlags.Undefined) throw new Error(`Property always undefined`)
			if (flags & ts.TypeFlags.Never) throw new Error(`Property of type 'never'`)
		} else {
			return (
				this.toArrayProperty() ||
				this.toTupleProperty() ||
				// this.toFunctionProperty() ||
				this.toMapProperty() ||
				this.toSetProperty() ||
				this.toRecordProperty() ||
				this.toObjectProperty()
			)
		}
		return new UnknownProperty()

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
		const cached = Type.propertiesCache.get(this.type)
		if (cached) return cached

		const properties: Properties = {}

		this.type.getProperties().forEach(property => {
			console.log(`[${property.name}]`)
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

		Type.propertiesCache.set(this.type, properties)
		return properties
	}

	private getTypeOfSymbol(symbol: ts.Symbol): Type {
		return new Type(
			getTypeChecker().getTypeOfSymbolAtLocation(symbol, this.node),
			this.node
		)
	}

	private toObjectProperty(): ObjectProperty {
		// const objectType = this.type as ts.ObjectType
		// console.log(`objectType.flags`, objectType.objectFlags)
		return new ObjectProperty(this.getProperties())
	}

	private toArrayProperty(): ArrayProperty | null {
		const itemsType = getArrayType(this.type)
		if (!itemsType) return null
		return new ArrayProperty(new Type(itemsType, this.node).toProperty())
	}

	private toFunctionProperty(): FunctionProperty | null {
		const signatures = getTypeChecker().getSignaturesOfType(
			this.type,
			ts.SignatureKind.Call
		)
		if (!signatures.length) return null

		return new FunctionProperty(
			signatures.map(signature => ({
				parameters:
					signature.parameters.map(parameter =>
						this.getTypeOfSymbol(parameter).toProperty()
					) || [],
				returnType: new Type(signature.getReturnType(), this.node).toProperty(),
			}))
		)
	}

	private toRecordProperty(): RecordProperty | null {
		return null
	}

	private toMapProperty(): MapProperty | null {
		return null
	}

	private toSetProperty(): SetProperty | null {
		return null
	}

	// private toDateProperty(): Property | null {
	// 	return null
	// }

	private toTupleProperty(): TupleProperty | null {
		return null
		// private isTuple(): boolean {
		// 	if (!(this.type.flags & ts.TypeFlags.Object)) return false
		// 	const objectType = this.type as ts.ObjectType

		// 	if (objectType.objectFlags & ts.ObjectFlags.Reference) {
		// 		const referenceType = this.type as ts.TypeReference
		// 		return new Type(referenceType.target).isTuple()
		// 	}

		// 	return !!(objectType.objectFlags & ts.ObjectFlags.Tuple)
		// }
	}

	// private isRecord(): boolean {
	// 	if (!(this.type.flags & ts.TypeFlags.Object)) return false
	// 	const symbol = this.type.getSymbol()
	// 	if (!symbol) return false
	// 	if (!(symbol.flags & ts.SymbolFlags.TypeLiteral)) return false

	// 	const objectType = this.type as ts.ObjectType
	// 	return !!(objectType.objectFlags & ts.ObjectFlags.Mapped)
	// }
}
