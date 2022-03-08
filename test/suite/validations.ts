import start from "fartest"
import { Type } from "../../source/types/Type/Type"
import * as Types from "../../source/types/Type/Types"
import { TypeName } from "../../source/types/Type/TypeName"
import { validate } from "../../source/validate"
import util from "util"

start("Validations", async ({ stage, test, same }) => {
	const pass = (schema: Type, ...values: Array<unknown>) => {
		for (const value of values) {
			const errors = validate({}, schema, value)
			test(
				errors.length == 0,
				`Validation should pass but errors raised:\n${errors
					.map(error => "    " + error)
					.join("\n")}`
			)
		}
	}
	const fail = (schema: Type, ...values: Array<unknown>) => {
		for (const value of values) {
			const errors = validate({}, schema, value)
			test(
				errors.length > 0,
				`Validation should fail but succeeded for value ${util.inspect(value)}`
			)
		}
	}

	const checkers: Record<TypeName, any> = {
		"Resolving...": null,
		Reference: null,

		Any() {
			pass(new Types.AnyType(), undefined, 0, false, "", {}, [], new Set(), new Map())
		},
		Unknown() {
			pass(new Types.UnknownType(), undefined, 0, false, "", {}, [], new Set(), new Map())
		},

		// -- Literals --
		Null() {
			pass(new Types.NullType(), null)
			fail(new Types.NullType(), undefined, 0, false, "", {}, [])
		},
		Undefined() {
			pass(new Types.UndefinedType(), undefined)
			fail(new Types.UndefinedType(), null, 0, false, "", {}, [])
		},
		Void() {
			pass(new Types.VoidType(), undefined)
			fail(new Types.VoidType(), null, 0, false, "", {}, [])
		},
		NumberLiteral() {
			pass(new Types.NumberLiteralType(12), 12)
			fail(new Types.NumberLiteralType(12), 13)
			fail(new Types.NumberLiteralType(12), "12")
		},
		StringLiteral() {
			pass(new Types.StringLiteralType("12"), "12")
			fail(new Types.StringLiteralType("12"), "13")
			fail(new Types.StringLiteralType("12"), 12)
		},
		BooleanLiteral() {
			pass(new Types.BooleanLiteralType(true), true)
			pass(new Types.BooleanLiteralType(false), false)
			fail(new Types.BooleanLiteralType(true), false)
			fail(new Types.BooleanLiteralType(false), true)
			fail(new Types.BooleanLiteralType(false), 0, 1, "", null, undefined, {}, [])
			fail(new Types.BooleanLiteralType(true), 0, 1, "", null, undefined, {}, [])
		},
		BigIntegerLiteral() {
			pass(new Types.BigIntegerLiteralType("12"), 12n)
			fail(new Types.BigIntegerLiteralType("12"), 12, 13n)
		},

		// -- Primitives --
		Number() {
			pass(new Types.NumberType(), 0, -0, 12, -15, 12.123, 1e4, Infinity, -Infinity, NaN)
			fail(new Types.NumberType(), "0", true, false, null, undefined, {}, [])
		},
		String() {
			pass(new Types.StringType(), "0", "azeaze", "")
			fail(new Types.StringType(), 0, true, false, null, undefined, {}, [])
		},
		Boolean() {
			pass(new Types.BooleanType(), true, false)
			fail(new Types.BooleanType(), 0, "", null, undefined, {}, [])
		},
		BigInteger() {
			pass(new Types.BigIntegerType(), 0n, BigInt(51321), -51312n, BigInt(-51321))
			fail(
				new Types.BigIntegerType(),
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
			pass(new Types.RegularExpressionType(), /aze/g, new RegExp("any", "gi"))
			fail(new Types.RegularExpressionType(), {}, [])
		},
		Date() {
			pass(new Types.DateType(), new Date())
			fail(new Types.DateType(), Date.now(), 0, "53215312", {}, null)
		},
		ArrayBuffer() {
			pass(new Types.ArrayBufferType(), Uint8Array.of(5, 12, 15).buffer)
			fail(new Types.ArrayBufferType(), {}, Uint8Array.of(5, 12, 15), [])
		},

		// -- Composables --
		Object() {
			pass(
				new Types.ObjectType({
					x: new Types.NumberType(),
				}),
				{ x: 12 },
				{ x: 12, z: 653123 }
			)
			fail(
				new Types.ObjectType({
					x: new Types.NumberType(),
				}),
				null,
				{},
				{ x: "12" },
				{ y: 513 }
			)
		},
		Array() {
			pass(new Types.ArrayType(new Types.NumberType()), [], [12, 16, 12, 13])
			fail(new Types.ArrayType(new Types.NumberType()), [15, 16, "12"], [{}])
		},
		Set() {
			pass(
				new Types.SetType(new Types.NumberType()),
				new Set(),
				new Set([]),
				new Set([12, 16, 12, 13])
			)
			fail(new Types.SetType(new Types.NumberType()), [], new Set([15, 16, "12"]), {})
		},
		Tuple() {
			pass(
				new Types.TupleType([new Types.NumberType(), new Types.StringLiteralType("foo")]),
				[12, "foo"]
			)
			fail(
				new Types.TupleType([new Types.NumberType(), new Types.StringLiteralType("foo")]),
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
				new Types.UnionType([new Types.NumberType(), new Types.StringLiteralType("foo")]),
				12,
				0,
				"foo"
			)
			fail(
				new Types.UnionType([new Types.NumberType(), new Types.StringLiteralType("foo")]),
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
				new Types.RecordType(new Types.StringType(), new Types.NumberType()),
				{},
				{ foo: 0, bar: 1 }
			)
			pass(
				new Types.RecordType(
					new Types.UnionType([new Types.StringLiteralType("foo")]),
					new Types.NumberType()
				),
				{ foo: 0 }
			)
			pass(
				new Types.RecordType(
					new Types.EnumerationType({ foo: new Types.StringLiteralType("foo") }),
					new Types.NumberType()
				),
				{ foo: 0 }
			)
			fail(new Types.RecordType(new Types.StringType(), new Types.NumberType()), {
				foo: 0,
				bar: "1",
			})
			fail(
				new Types.RecordType(
					new Types.UnionType([new Types.StringLiteralType("foo")]),
					new Types.NumberType()
				),
				{},
				{ foo: 0, bar: 0 },
				{ bar: 0 }
			)
			fail(
				new Types.RecordType(
					new Types.EnumerationType({ foo: new Types.StringLiteralType("foo") }),
					new Types.NumberType()
				),
				{},
				{ foo: 0, bar: 0 },
				{ bar: 0 }
			)
		},
		Map() {
			pass(
				new Types.MapType(new Types.StringType(), new Types.NumberType()),
				new Map(),
				new Map([
					["foo", 0],
					["bar", 1],
				])
			)
			pass(
				new Types.MapType(
					new Types.UnionType([new Types.StringLiteralType("foo")]),
					new Types.NumberType()
				),
				new Map(),
				new Map([["foo", 0]])
			)
			pass(
				new Types.MapType(
					new Types.ObjectType({ foo: new Types.NumberType() }),
					new Types.NumberType()
				),
				new Map(),
				new Map([[{ foo: 0 }, 0]])
			)
			fail(
				new Types.MapType(
					new Types.ObjectType({ foo: new Types.NumberType() }),
					new Types.NumberType()
				),
				new Map([[{}, 0]]),
				new Map([[{ bar: 0 }, 0]]),
				new Map([[{ foo: 0 }, "0"]])
			)
		},
		Enumeration() {
			pass(
				new Types.EnumerationType({
					zero: new Types.NumberLiteralType(0),
					foo: new Types.StringLiteralType("foo"),
				}),
				0,
				"foo"
			)
			fail(
				new Types.EnumerationType({
					zero: new Types.NumberLiteralType(0),
					foo: new Types.StringLiteralType("foo"),
				}),
				1,
				"bar"
			)
		},
		Function() {
			pass(
				new Types.FunctionType([]),
				function () {},
				() => {}
			)
			fail(new Types.FunctionType([]), {})
		},
		Class() {
			pass(new Types.FunctionType([]), class {})
			fail(new Types.FunctionType([]), {})
		},
	}

	for (const type in checkers) {
		const checker = checkers[type as TypeName]
		if (!checker) continue
		stage(type)
		checker()
	}
})
