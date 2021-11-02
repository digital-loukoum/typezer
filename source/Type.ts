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
	ClassProperty,
	InterfaceProperty,
	TypeAliasProperty,
	FunctionProperty,
	VoidProperty,
} from "./Property"
import { getTypeChecker } from "./typeChecker"
import { getPropertyName } from "./utilities"

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

	// static fromSymbol(symbol: ts.Symbol): Type {
	// 	const declarations = symbol.getDeclarations()
	// 	if (!declarations) throw `No declarations for symbol ${symbol.getName()}`
	// 	return new Type(
	// 		getTypeChecker().getTypeAtLocation(declarations[declarations.length - 1])
	// 	)
	// }

	toProperty(): Property {
		// console.log("toProperty:", this.type)
		console.log(`type.flags`, this.type.flags)
		console.log(`this.type.getSymbol()?.name`, this.type.getSymbol()?.name)
		console.log(`this.type.getSymbol()?.flags`, this.type.getSymbol()?.flags)
		console.log(
			`getSignaturesOfType(type).length`,
			getTypeChecker().getSignaturesOfType(this.type, ts.SignatureKind.Call).length
		)
		// console.log(
		// 	`typeArguments`,
		// 	getTypeChecker()
		// 		.getTypeArguments(this.type as ts.TypeReference)
		// 		.map(subtype => new Type(subtype).toProperty())
		// )
		const { flags } = this.type

		// if (this.node?.kind == ts.SyntaxKind.ClassDeclaration)
		// 	return new ClassProperty(this.getProperties())
		// if (this.node?.kind == ts.SyntaxKind.InterfaceDeclaration)
		// 	return new InterfaceProperty(this.getProperties())
		// if (this.node?.kind == ts.SyntaxKind.TypeAliasDeclaration)
		// 	return new TypeAliasProperty(this.getProperties())

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

		if (flags & ts.TypeFlags.Object) {
			return (
				this.toFunctionProperty() ||
				this.toArrayProperty() ||
				this.toTupleProperty() ||
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
	}

	static propertiesCache = new Map<ts.Type, Properties>()

	getProperties(): Properties {
		const cached = Type.propertiesCache.get(this.type)
		if (cached) return cached

		const properties: Properties = {}

		this.type.getProperties().forEach(property => {
			const propertyType = this.getTypeOfSymbol(property)
			properties[property.name] = propertyType.toProperty()
		})

		Type.propertiesCache.set(this.type, properties)
		return properties
	}

	private getTypeOfSymbol(symbol: ts.Symbol): Type {
		console.log(`GETTING TYPE OF SYMBOL ${symbol.getName()}!!!!`)
		return new Type(
			getTypeChecker().getTypeOfSymbolAtLocation(symbol, this.node),
			this.node
		)
	}

	private toObjectProperty(): ObjectProperty {
		const objectType = this.type as ts.ObjectType

		console.log(`objectType.flags`, objectType.objectFlags)
		return new ObjectProperty(this.getProperties())
	}

	private toArrayProperty(): ArrayProperty | null {
		return null
	}

	private toFunctionProperty(): FunctionProperty | null {
		const signatures = getTypeChecker().getSignaturesOfType(
			this.type,
			ts.SignatureKind.Call
		)
		if (!signatures.length) return null

		console.log("!!!", signatures[0].getTypeParameters()?.length)
		console.log("!!!", signatures[0].parameters.length)

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
