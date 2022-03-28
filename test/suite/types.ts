import { getSchema } from "../../source"
import start from "fartest"
import { Types } from "../../source/types/Type/Types"
import { Type } from "../../source/types/Type/Type"

start("Types", async ({ stage, test, same }) => {
	const schema = getSchema({
		files: ["test/samples/types.ts"],
	})

	// console.dir(schema, { depth: null })
	// return

	const getTarget = <T extends Type = Type>(type: Type): T => {
		return type as T
	}

	const getRootType = <T extends Type = Types["Object"]>(name: string): T => {
		let result: Type = schema[name]
		if (!result) throw new Error(`Declaration '${name}' does not exist in schema`)
		return result as T
	}

	stage("Primitives")
	{
		const { properties } = getRootType("Primitives")

		for (const primitive in properties) {
			const { typeName, optional, modifiers } = properties[primitive]
			same(
				primitive.toLowerCase(),
				typeName.toLowerCase(),
				`Check primitive '${primitive}'`
			)
			test(!optional, `Check primitive '${primitive}' is required`)
			test(!modifiers?.length, `Check primitive '${primitive}' has no modifiers`)
		}
	}

	stage("Partial primitives")
	{
		const { properties } = getRootType("PartialPrimitives")

		for (const primitive in properties) {
			const { typeName, optional, modifiers } = properties[primitive]
			same(
				primitive.toLowerCase(),
				typeName.toLowerCase(),
				`Check partial primitive '${primitive}'`
			)
			same(optional, true, `Check partial primitive '${primitive}' is optional`)
			test(!modifiers?.length, `Check partial primitive '${primitive}' has no modifiers`)
		}
	}

	stage("Literals")
	{
		const { properties } = getRootType("Literals")

		for (const literal in properties) {
			const { typeName, optional, modifiers } = properties[literal]
			same(literal.toLowerCase(), typeName.toLowerCase(), `Check literal '${literal}'`)
			test(!optional, `Check literal '${literal}' is required`)
			test(!modifiers?.length, `Check literal '${literal}' has no modifiers`)
		}
	}

	stage("Classes")
	{
		const root = getRootType<Types["Class"]>("Class")
		same(root.typeName, "Class")
		for (const [propertyName, property] of Object.entries(root.properties)) {
			if (property.modifiers?.includes("static"))
				same(propertyName, "static", `'static' property should be static`)
			else same(propertyName, "notStatic", `'notStatic' property should not be static`)
		}
	}

	stage("Modifiers")
	{
		const { properties } = getRootType("Modifiers")

		for (const modifier in properties) {
			const { modifiers } = properties[modifier]
			same([modifier], modifiers, `Check modifier '${modifier}'`)
		}
	}

	stage("Promises")
	{
		const { properties } = getRootType("Promises")

		for (const value in properties) {
			const promise = getTarget<Types["Promise"]>(properties[value])
			same(promise.typeName, "Promise", `Check promise '${value}' is a promise`)
			same(value, promise.item.typeName, `Check item type of promise '${value}'`)
		}
	}

	stage("Arrays")
	{
		const { properties } = getRootType("Arrays")

		for (const value in properties) {
			const array = getTarget<Types["Array"]>(properties[value])
			same(array.typeName, "Array", `Check array '${value}' is an array`)
			same(value, array.items.typeName, `Check items type of array '${value}'`)
		}
	}

	stage("Records")
	{
		const { properties } = getRootType("Records")

		for (const value in properties) {
			const record = getTarget<Types["Record"]>(properties[value])
			same(record.typeName, "Record", `Check record '${value}' is a record`)
			const [keyType, valueType] = value.split("_")
			same(
				record.keys.typeName,
				keyType,
				`Check key of record '${value}' has the right type`
			)
			same(
				record.items.typeName,
				valueType,
				`Check value of record '${value}' has the right type`
			)
		}
	}

	stage("Tuples")
	{
		const { properties } = getRootType("Tuples")

		for (const value in properties) {
			const tuple = getTarget<Types["Tuple"]>(properties[value])
			same(tuple.typeName, "Tuple", `Check tuple '${value}' is a tuple`)
			const types = value.split("_")
			same(
				tuple.items.map(({ typeName }) => typeName),
				types,
				`Check items of tuple '${value}' have the right type`
			)
		}
	}

	stage("Maps")
	{
		const { properties } = getRootType("Maps")

		for (const value in properties) {
			const map = getTarget<Types["Map"]>(properties[value])
			same(map.typeName, "Map", `Check map '${value}' is a map`)
			const [keyType, valueType] = value.split("_")
			same(map.keys.typeName, keyType, `Check key of map '${value}' has the right type`)
			same(
				map.items.typeName,
				valueType,
				`Check value of map '${value}' has the right type`
			)
		}
	}

	stage("Sets")
	{
		const { properties } = getRootType("Sets")

		for (const value in properties) {
			const set = getTarget<Types["Set"]>(properties[value])
			same(set.typeName, "Set", `Check set '${value}' is a set`)
			same(value, set.items.typeName, `Check items type of set '${value}'`)
		}
	}

	stage("Unions")
	{
		const { properties } = getRootType("Unions")

		for (const value in properties) {
			const union = getTarget<Types["Union"]>(properties[value])
			same(union.typeName, "Union", `Check union '${value}' is a union`)
			const types = value.split("_")
			same(
				union.items.map(({ typeName }) => typeName).sort(),
				types.sort(),
				`Check items of union '${value}' have the right type`
			)
		}
	}

	stage("Enumerations")
	{
		const { properties } = getRootType("Enumerations")

		for (const value in properties) {
			const enumeration = getTarget<Types["Enumeration"]>(properties[value])
			for (const key in enumeration.items) {
				const value = (
					enumeration.items[key] as Types["NumberLiteral"] | Types["StringLiteral"]
				).value
				same(
					key[0] == "$" ? +key.slice(1) : key,
					value,
					`Check values of enumeration '${value}' are valid`
				)
			}
		}
	}

	stage("Functions")
	{
		const { properties } = getRootType("Functions")

		for (const value in properties) {
			const [type, returnType] = value.split("_")
			same(
				type,
				properties[value].typeName,
				`Check function '${value}' has the right type`
			)
			const callable = properties[value] as Types["Function"]
			const [signature] = callable.signatures
			same(
				returnType,
				signature.returnType.typeName,
				`Check return type of function '${value}'`
			)
		}
	}

	stage("Constructors")
	{
		const constructor = getRootType<Types["Class"]>("Constructor")
		same(constructor.typeName, "Class", `Check class is a class`)
		const prototype = constructor.properties.prototype as Types["Object"]
		for (const [propertyName, property] of Object.entries(constructor.properties)) {
			same(
				propertyName,
				property.typeName,
				`Property of constructor prototype has the right type`
			)
			same(
				!!property.modifiers?.includes("static"),
				false,
				`Non-static property should not have static modifier`
			)
		}
		for (const [propertyName, property] of Object.entries(constructor.staticProperties)) {
			same(
				propertyName,
				property.typeName,
				`Property of constructor prototype has the right type`
			)
			same(
				!!property.modifiers?.includes("static"),
				true,
				`Static property should have static modifier`
			)
		}
	}
	{
		const { properties } = getRootType("Constructors")

		for (const value in properties) {
			const [type, minimumParameters, ...parameters] = value.split("_")
			same(type, properties[value].typeName, `Check class '${value}' is a class`)
			const callable = properties[value] as Types["Class"]
			const { signature } = callable
			same(
				+minimumParameters,
				signature?.minimumParameters,
				`Minimum parameters of constructor '${value}'`
			)
			same(
				parameters,
				signature?.parameters.map(type => type.typeName),
				`Parameters type of constructor '${value}'`
			)
		}
	}

	stage("Circular references")
	{
		const root = getRootType("CircularReference")
		const self = root.properties.self as Types["CircularReference"]
		same(self.typeName, "CircularReference")
		same(self.level, 1)
	}
})
