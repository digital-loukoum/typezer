import { Typezer } from "../../source"
import start from "fartest"
import * as Types from "../../source/types/Type/Types"

start("Types", async ({ stage, test, same }) => {
	const typezer = new Typezer(["test/samples/types.ts"])
	const declarations = Object.fromEntries(
		typezer.getAllDeclarations().map(declaration => [declaration.name, declaration])
	)
	const { definitions } = typezer
	const getType = (name: string): Types.ObjectType => {
		const reference = declarations[name].value as Types.ReferenceType
		same(reference.reference, name)
		return definitions[reference.reference].type as Types.ObjectType
	}

	stage("Primitives")
	{
		const { properties } = getType("Primitives")

		for (const primitive in properties) {
			const { type, optional, modifiers } = properties[primitive]
			same(primitive.toLowerCase(), type.toLowerCase(), `Check primitive '${primitive}'`)
			test(!optional, `Check primitive '${primitive}' is required`)
			test(!modifiers?.length, `Check primitive '${primitive}' has no modifiers`)
		}
	}

	stage("Partial primitives")
	{
		const { properties } = getType("PartialPrimitives")

		for (const primitive in properties) {
			const { type, optional, modifiers } = properties[primitive]
			same(
				primitive.toLowerCase(),
				type.toLowerCase(),
				`Check partial primitive '${primitive}'`
			)
			same(optional, true, `Check partial primitive '${primitive}' is optional`)
			test(!modifiers?.length, `Check partial primitive '${primitive}' has no modifiers`)
		}
	}

	stage("Literals")
	{
		const { properties } = getType("Literals")

		for (const literal in properties) {
			const { type, optional, modifiers } = properties[literal]
			same(literal.toLowerCase(), type.toLowerCase(), `Check literal '${literal}'`)
			test(!optional, `Check literal '${literal}' is required`)
			test(!modifiers?.length, `Check literal '${literal}' has no modifiers`)
		}
	}

	stage("Modifiers")
	{
		const { properties } = getType("Modifiers")

		for (const modifier in properties) {
			const { modifiers } = properties[modifier]
			same([modifier], modifiers, `Check modifier '${modifier}'`)
		}
	}

	stage("Arrays")
	{
		const { properties } = getType("Arrays")

		for (const value in properties) {
			same(properties[value].type, "Array", `Check array '${value}' is an array`)
			same(
				value,
				(properties[value] as Types.ArrayType).of.type,
				`Check items type of array '${value}'`
			)
		}
	}

	stage("Records")
	{
		const { properties } = getType("Records")

		for (const value in properties) {
			const { reference } = properties[value] as Types.ReferenceType
			const record = definitions[reference].type as Types.RecordType
			same(record.type, "Record", `Check record '${value}' is a record`)
			const [keyType, valueType] = value.split("_")
			same(record.key.type, keyType, `Check key of record '${value}' has the right type`)
			same(
				record.value.type,
				valueType,
				`Check value of record '${value}' has the right type`
			)
		}
	}

	stage("Tuples")
	{
		const { properties } = getType("Tuples")

		for (const value in properties) {
			const tuple = properties[value] as Types.TupleType
			same(tuple.type, "Tuple", `Check tuple '${value}' is a tuple`)
			const types = value.split("_")
			same(
				tuple.of.map(({ type }) => type),
				types,
				`Check items of tuple '${value}' have the right type`
			)
		}
	}

	stage("Maps")
	{
		const { properties } = getType("Maps")

		for (const value in properties) {
			const map = properties[value] as Types.MapType
			same(map.type, "Map", `Check map '${value}' is a map`)
			const [keyType, valueType] = value.split("_")
			same(map.key.type, keyType, `Check key of map '${value}' has the right type`)
			same(map.value.type, valueType, `Check value of map '${value}' has the right type`)
		}
	}

	stage("Sets")
	{
		const { properties } = getType("Sets")

		for (const value in properties) {
			same(properties[value].type, "Set", `Check set '${value}' is a set`)
			same(
				value,
				(properties[value] as Types.SetType).of.type,
				`Check items type of set '${value}'`
			)
		}
	}

	stage("Unions")
	{
		const { properties } = getType("Unions")

		for (const value in properties) {
			const union = properties[value] as Types.UnionType
			same(union.type, "Union", `Check union '${value}' is a union`)
			const types = value.split("_")
			same(
				union.types.map(({ type }) => type).sort(),
				types.sort(),
				`Check items of union '${value}' have the right type`
			)
		}
	}

	stage("Enumerations")
	{
		const { properties } = getType("Enumerations")

		for (const value in properties) {
			const { reference } = properties[value] as Types.ReferenceType
			const enumeration = definitions[reference].type as Types.EnumerationType
			for (const key in enumeration.properties) {
				const value = (
					enumeration.properties[key] as Types.NumberLiteralType | Types.StringLiteralType
				).value
				same(
					key[0] == "$" ? +key.slice(1) : key,
					value,
					`Check values of enumeration '${value}' are valid`
				)
			}
		}
	}

	stage("Functions and constructors")
	{
		const { properties } = getType("Functions")

		for (const value in properties) {
			const [type, returnType] = value.split("_")
			same(type, properties[value].type, `Check callable '${value}' has the right type`)
			const callable = properties[value] as Types.FunctionType | Types.ClassType
			const [signature] = callable.signatures
			same(
				returnType,
				signature.returnType.type,
				`Check return type of callable '${value}'`
			)
		}
	}

	stage("Circular references")
	{
		const root = getType("CircularReference")
		same(root.id, root.properties.self.id)
	}
})
