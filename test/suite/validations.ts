import start from "fartest"
import { Type } from "../../source/types/Type/Type"
import { TypeName } from "../../source/types/Type/TypeName"
import { validateType, validateSignature } from "../../source/validate"
import inspect from "object-inspect"
import { Types } from "../../source/types/Type/Types"
import { findManyDeclarations } from "../../source"
import { primitives } from "../samples/toValidate"

start("Validations", async ({ stage, test, same }) => {
	stage("Validation API")
	{
		const schema = findManyDeclarations({
			files: ["test/samples/toValidate.ts"],
		})
		const errors = validateType(schema, "primitives", primitives)
		same(errors, [], "Validation of primitives")
	}

	const pass = (type: Type, ...values: Array<unknown>) => {
		for (const value of values) {
			const errors = validateType({ type } as any, "type", value)
			test(
				errors.length == 0,
				`Validation should pass but errors raised:\n${errors
					.map(error => "    " + error)
					.join("\n")}`
			)
		}
	}
	const fail = (type: Type, ...values: Array<unknown>) => {
		for (const value of values) {
			const errors = validateType({ type } as any, "type", value)
			test(
				errors.length > 0,
				`Validation should fail but succeeded for value ${inspect(value)}`
			)
		}
	}

	const checkers: Record<TypeName, any> = {
		Reference: null,
		CircularReference: null,
		Unresolved: null,

		Unknown() {
			pass({ typeName: "Unknown" }, undefined, 0, false, "", {}, [], new Set(), new Map())
		},
		Never() {
			fail({ typeName: "Never" }, undefined, 0, false, "", {}, [], new Set(), new Map())
		},
		Any() {
			pass({ typeName: "Any" }, undefined, 0, false, "", {}, [], new Set(), new Map())
		},

		// -- Literals --
		Null() {
			pass({ typeName: "Null" }, null)
			fail({ typeName: "Null" }, undefined, 0, false, "", {}, [])
		},
		Undefined() {
			pass({ typeName: "Undefined" }, undefined)
			fail({ typeName: "Undefined" }, null, 0, false, "", {}, [])
		},
		Void() {
			pass({ typeName: "Void" }, undefined)
			fail({ typeName: "Void" }, null, 0, false, "", {}, [])
		},
		NumberLiteral() {
			pass({ typeName: "NumberLiteral", value: 12 }, 12)
			fail({ typeName: "NumberLiteral", value: 12 }, 13)
			fail({ typeName: "NumberLiteral", value: 12 }, "12")
		},
		StringLiteral() {
			pass({ typeName: "StringLiteral", value: "12" }, "12")
			fail({ typeName: "StringLiteral", value: "12" }, "13")
			fail({ typeName: "StringLiteral", value: "12" }, 12)
		},
		TemplateLiteral() {
			pass(
				{ typeName: "TemplateLiteral", texts: ["", ""], types: ["number"] },
				"0",
				"12321",
				"-5312",
				"-123e12",
				"-123e-12"
			)
			pass(
				{
					typeName: "TemplateLiteral",
					texts: ["before ", "", " after"],
					types: ["string", "bigint"],
				},
				"before any 5321312 after",
				"before 5321312 after"
			)
			fail(
				{
					typeName: "TemplateLiteral",
					texts: ["before ", "", " after"],
					types: ["string", "bigint"],
				},
				"before any 5321312 afte",
				"efore any 5321312 after",
				"before any  after"
			)
			fail(
				{ typeName: "TemplateLiteral", texts: ["", ""], types: ["number"] },
				"a",
				"12321a",
				"-123e12e2"
			)
			fail(
				{ typeName: "TemplateLiteral", texts: ["", ""], types: ["bigint"] },
				"a",
				"12321a",
				"-5312.2",
				"0."
			)
		},
		BooleanLiteral() {
			pass({ typeName: "BooleanLiteral", value: true }, true)
			pass({ typeName: "BooleanLiteral", value: false }, false)
			fail({ typeName: "BooleanLiteral", value: true }, false)
			fail({ typeName: "BooleanLiteral", value: false }, true)
			fail(
				{ typeName: "BooleanLiteral", value: false },
				0,
				1,
				"",
				null,
				undefined,
				{},
				[]
			)
			fail({ typeName: "BooleanLiteral", value: true }, 0, 1, "", null, undefined, {}, [])
		},
		BigIntegerLiteral() {
			pass({ typeName: "BigIntegerLiteral", value: "12" }, 12n)
			fail({ typeName: "BigIntegerLiteral", value: "12" }, 12, 13n)
		},

		// -- Primitives --
		Number() {
			pass({ typeName: "Number" }, 0, -0, 12, -15, 12.123, 1e4, Infinity, -Infinity, NaN)
			fail({ typeName: "Number" }, "0", true, false, null, undefined, {}, [])
		},
		String() {
			pass({ typeName: "String" }, "0", "azeaze", "")
			fail({ typeName: "String" }, 0, true, false, null, undefined, {}, [])
		},
		Boolean() {
			pass({ typeName: "Boolean" }, true, false)
			fail({ typeName: "Boolean" }, 0, "", null, undefined, {}, [])
		},
		Symbol() {
			pass({ typeName: "Symbol" }, Symbol(12), Symbol("1213"))
			fail({ typeName: "Symbol" }, 0, "", null, undefined, {}, [])
		},
		BigInteger() {
			pass({ typeName: "BigInteger" }, 0n, BigInt(51321), -51312n, BigInt(-51321))
			fail(
				{ typeName: "BigInteger" },
				0,
				12,
				-45,
				132.123,
				"0",
				true,
				false,
				null,
				undefined,
				{},
				[]
			)
		},
		RegularExpression() {
			pass({ typeName: "RegularExpression" }, /aze/g, new RegExp("any", "gi"))
			fail({ typeName: "RegularExpression" }, {}, [])
		},
		Date() {
			pass({ typeName: "Date" }, new Date())
			fail({ typeName: "Date" }, Date.now(), 0, "53215312", {}, null)
		},
		ArrayBuffer() {
			pass({ typeName: "ArrayBuffer" }, Uint8Array.of(5, 12, 15).buffer)
			fail({ typeName: "ArrayBuffer" }, {}, Uint8Array.of(5, 12, 15), [])
		},

		// -- Composables --
		Promise() {
			pass({ typeName: "Promise", item: { typeName: "Number" } }, 12)
			fail(
				{ typeName: "Promise", item: { typeName: "Number" } },
				[],
				"12",
				{},
				new Promise(resolve => resolve(12))
			)
		},
		Object() {
			pass(
				{
					typeName: "Object",
					properties: {
						x: { typeName: "Number" },
					},
				},
				{ x: 12 },
				{ x: 12, z: 653123 }
			)
			fail(
				{
					typeName: "Object",
					properties: {
						x: { typeName: "Number" },
					},
				},
				null,
				{},
				{ x: "12" },
				{ y: 513 }
			)
		},
		Namespace() {
			pass(
				{
					typeName: "Namespace",
					properties: {
						x: { typeName: "Number" },
					},
				},
				{ x: 12 },
				{ x: 12, z: 653123 }
			)
			fail(
				{
					typeName: "Namespace",
					properties: {
						x: { typeName: "Number" },
					},
				},
				null,
				{},
				{ x: "12" },
				{ y: 513 }
			)
		},
		Class() {
			const classType: Types["Class"] = {
				typeName: "Class",
				staticProperties: {
					static: { typeName: "Number", modifiers: ["static"] },
				},
				properties: {
					x: { typeName: "Number" },
				},
			}
			pass(classType, { x: 12 }, { x: 12, static: "653123" })
			fail(classType, null, {}, { x: "12" }, { static: 513 }, { y: 513 })
		},
		Array() {
			pass({ typeName: "Array", items: { typeName: "Number" } }, [], [12, 16, 12, 13])
			fail({ typeName: "Array", items: { typeName: "Number" } }, [15, 16, "12"], [{}])
		},
		Set() {
			pass(
				{ typeName: "Set", items: { typeName: "Number" } },
				new Set(),
				new Set([]),
				new Set([12, 16, 12, 13])
			)
			fail(
				{ typeName: "Set", items: { typeName: "Number" } },
				[],
				new Set([15, 16, "12"]),
				{}
			)
		},
		Tuple() {
			pass(
				{
					typeName: "Tuple",
					items: [{ typeName: "Number" }, { typeName: "StringLiteral", value: "foo" }],
				},
				[12, "foo"]
			)
			fail(
				{
					typeName: "Tuple",
					items: [{ typeName: "Number" }, { typeName: "StringLiteral", value: "foo" }],
				},
				[],
				[12],
				["foo"],
				[12, "foo", undefined],
				[12, "foo", 5123],
				null,
				{}
			)
		},
		Union() {
			pass(
				{
					typeName: "Union",
					items: [{ typeName: "Number" }, { typeName: "StringLiteral", value: "foo" }],
				},
				12,
				0,
				"foo"
			)
			fail(
				{
					typeName: "Union",
					items: [{ typeName: "Number" }, { typeName: "StringLiteral", value: "foo" }],
				},
				"12",
				"0",
				"foobar",
				{},
				null,
				false
			)
		},
		Record() {
			pass(
				{
					typeName: "Record",
					keys: { typeName: "String" },
					items: { typeName: "Number" },
				},
				{},
				{ foo: 0, bar: 1 }
			)
			pass(
				{
					typeName: "Record",
					keys: {
						typeName: "Union",
						items: [{ typeName: "StringLiteral", value: "foo" }],
					},
					items: { typeName: "Number" },
				},
				{ foo: 0 }
			)
			pass(
				{
					typeName: "Record",
					keys: {
						typeName: "Enumeration",
						items: { foo: { typeName: "StringLiteral", value: "foo" } },
					},
					items: { typeName: "Number" },
				},
				{ foo: 0 }
			)
			fail(
				{
					typeName: "Record",
					keys: { typeName: "String" },
					items: { typeName: "Number" },
				},
				{
					foo: 0,
					bar: "1",
				}
			)
			fail(
				{
					typeName: "Record",
					keys: {
						typeName: "Union",
						items: [{ typeName: "StringLiteral", value: "foo" }],
					},
					items: { typeName: "Number" },
				},
				{},
				{ foo: 0, bar: 0 },
				{ bar: 0 }
			)
			fail(
				{
					typeName: "Record",
					keys: {
						typeName: "Enumeration",
						items: { foo: { typeName: "StringLiteral", value: "foo" } },
					},
					items: { typeName: "Number" },
				},
				{},
				{ foo: 0, bar: 0 },
				{ bar: 0 }
			)
		},
		Map() {
			pass(
				{ typeName: "Map", keys: { typeName: "String" }, items: { typeName: "Number" } },
				new Map(),
				new Map([
					["foo", 0],
					["bar", 1],
				])
			)
			pass(
				{
					typeName: "Map",
					keys: {
						typeName: "Union",
						items: [{ typeName: "StringLiteral", value: "foo" }],
					},
					items: { typeName: "Number" },
				},
				new Map(),
				new Map([["foo", 0]])
			)
			pass(
				{
					typeName: "Map",
					keys: { typeName: "Object", properties: { foo: { typeName: "Number" } } },
					items: { typeName: "Number" },
				},
				new Map(),
				new Map([[{ foo: 0 }, 0]])
			)
			fail(
				{
					typeName: "Map",
					keys: { typeName: "Object", properties: { foo: { typeName: "Number" } } },
					items: { typeName: "Number" },
				},
				new Map([[{}, 0]]),
				new Map([[{ bar: 0 }, 0]]),
				new Map([[{ foo: 0 }, "0"]])
			)
		},
		Enumeration() {
			pass(
				{
					typeName: "Enumeration",
					items: {
						zero: { typeName: "NumberLiteral", value: 0 },
						foo: { typeName: "StringLiteral", value: "foo" },
					},
				},
				0,
				"foo"
			)
			fail(
				{
					typeName: "Enumeration",
					items: {
						zero: { typeName: "NumberLiteral", value: 0 },
						foo: { typeName: "StringLiteral", value: "foo" },
					},
				},
				1,
				"bar"
			)
		},
		Function() {
			pass(
				{ typeName: "Function", signatures: [] },
				function () {},
				() => {}
			)
			fail({ typeName: "Function", signatures: [] }, {})

			var { errors, returnType } = validateSignature(
				{
					function: {
						declare: "function",
						exportedAs: [],
						fileName: "",
						id: "",
						name: "",
						typeName: "Function",
						signatures: [
							{
								minimumParameters: 1,
								returnType: { typeName: "String" },
								parameters: [{ typeName: "Number" }, { typeName: "String" }],
							},
						],
					},
				},
				"function",
				[12, "12"]
			)
			test(!errors?.length, "Signature validated")
			same(returnType, { typeName: "String" }, "Good return type")

			var { errors, returnType } = validateSignature(
				{
					function: {
						declare: "function",
						exportedAs: [],
						fileName: "",
						id: "",
						name: "",
						typeName: "Function",
						signatures: [
							{
								minimumParameters: 1,
								returnType: { typeName: "String" },
								parameters: [{ typeName: "String" }, { typeName: "String" }],
							},
							{
								minimumParameters: 1,
								returnType: { typeName: "Number" },
								parameters: [{ typeName: "Number" }, { typeName: "String" }],
							},
						],
					},
				},
				"function",
				[12, "12"]
			)
			test(!errors?.length, "Second signature validated")
			same(returnType, { typeName: "Number" }, "Second returnType returned")

			var { errors, returnType } = validateSignature(
				{
					function: {
						declare: "function",
						exportedAs: [],
						fileName: "",
						id: "",
						name: "",
						typeName: "Function",
						signatures: [
							{
								minimumParameters: 1,
								returnType: { typeName: "String" },
								parameters: [{ typeName: "Number" }, { typeName: "String" }],
							},
						],
					},
				},
				"function",
				["12", "12"]
			)
			test(!!errors?.length, "Signature errors expected")
			same(returnType, undefined, "No return type expected")
		},
	}

	for (const type in checkers) {
		const checker = checkers[type as TypeName]
		if (!checker) continue
		stage(type)
		checker()
	}
})
