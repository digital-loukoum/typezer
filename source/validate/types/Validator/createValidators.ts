import type { Validator } from "./Validator"
import type { Validators } from "./Validators"
import type * as Types from "../../../types/Type/Types"
import { definitions } from "../../../types/Definition/definitions"

export function createValidators(validator: Omit<Validator, "validators">): Validators {
	return {
		StringLiteral(type: Types.StringLiteralType, value) {
			if (value !== type.value) validator.mismatch(value, type.value)
		},

		NumberLiteral(type: Types.NumberLiteralType, value) {
			if (value !== type.value) validator.mismatch(value, type.value)
		},

		BigIntegerLiteral(type: Types.BigIntegerLiteralType, value) {
			if (value !== type.value) validator.mismatch(value, type.value)
		},

		BooleanLiteral(type: Types.BooleanLiteralType, value) {
			if (value !== type.value) validator.mismatch(value, type.value)
		},

		// --    PRIMITIVES    -- //
		Unknown(type: Types.UnknownType, value) {},

		Void(type: Types.VoidType, value) {
			if (value != null) validator.mismatch(value, "null | undefined")
		},

		Null(type: Types.NullType, value) {
			if (value !== null) validator.mismatch(value, "null")
		},

		Undefined(type: Types.UndefinedType, value) {
			if (value !== undefined) validator.mismatch(value, "undefined")
		},

		Any(type: Types.AnyType, value) {},

		Boolean(type: Types.BooleanType, value) {
			if (typeof value !== "boolean") validator.mismatch(value, "a boolean")
		},

		Number(type: Types.NumberType, value) {
			if (typeof value !== "number") validator.mismatch(value, "a number")
		},

		BigInteger(type: Types.BigIntegerType, value) {
			if (typeof value !== "bigint") validator.mismatch(value, "a big integer")
		},

		String(type: Types.StringType, value) {
			if (typeof value !== "string") validator.mismatch(value, "a string")
		},

		RegularExpression(type: Types.RegularExpressionType, value) {
			if (!(value instanceof RegExp)) validator.mismatch(value, "a regular expression")
		},

		Date(type: Types.DateType, value) {
			if (!(value instanceof Date)) validator.mismatch(value, "a date")
		},

		ArrayBuffer(type: Types.ArrayBufferType, value) {
			if (!(value instanceof ArrayBuffer)) validator.mismatch(value, "an array buffer")
		},

		// --    COMPOSABLES    -- //
		Object(type: Types.ObjectType, value) {
			if (!value || typeof value !== "object") validator.mismatch(value, "an object")
			else {
				for (const key in type.properties) {
					validator.path.push(key)
					validator.validate(type.properties[key], value[key])
					validator.path.pop()
				}
			}
		},

		Record(type: Types.RecordType, value) {
			if (!value || typeof value !== "object") validator.mismatch(value, "an record")
			else {
				for (const key in value) {
					validator.path.push(key)
					validator.validate(type.value, value[key])
					validator.path.pop()
				}
			}
		},

		Array(type: Types.ArrayType, value) {
			if (!Array.isArray(value)) validator.mismatch(value, "an array")
			else {
				value.forEach((item, index) => {
					validator.path.push(String(index))
					validator.validate(type.of, item)
					validator.path.pop()
				})
			}
		},

		Tuple(type: Types.TupleType, value) {
			if (!Array.isArray(value)) validator.mismatch(value, "a tuple")
			else {
				type.of.forEach((type, index) => {
					validator.path.push(String(index))
					validator.validate(type, value[index])
					validator.path.pop()
				})
			}
		},

		Map(type: Types.MapType, value) {
			if (!(value instanceof Map)) validator.mismatch(value, "a map")
			else {
				for (const [key, item] of value.entries()) {
					validator.path.push(!key || typeof key != "object" ? String(key) : "")
					validator.validate(type.key, key)
					validator.validate(type.value, item)
					validator.path.pop()
				}
			}
		},

		Set(type: Types.SetType, value) {
			if (!(value instanceof Set)) validator.mismatch(value, "a set")
			else {
				validator.path.push("")
				for (const key of value) {
					validator.validate(type.of, key)
				}
				validator.path.pop()
			}
		},

		Union(type: Types.UnionType, value) {
			for (const subtype of type.types) {
				const check = validator.fork().validate(subtype, value)
				if (!check.errors.length) return validator
			}
			validator.mismatch(value, type.toString())
		},

		Enumeration(type: Types.EnumerationType, value) {
			for (const subtype of Object.values(type.properties)) {
				const check = validator.fork().validate(subtype, value)
				if (!check.errors.length) return validator
			}
			validator.mismatch(value, type.toString())
		},

		Function(type: Types.FunctionType, value) {
			if (typeof value !== "function") validator.mismatch(value, "a function")
		},

		Class(type: Types.ClassType, value) {
			if (typeof value !== "function") validator.mismatch(value, "a class")
		},

		// --      SPECIALS     -- //
		"Resolving..."(type: Types.ResolvingType, value) {},

		Reference(type: Types.ReferenceType, value) {
			const definition = definitions[type.reference]
			if (definition) {
				validator.validate(definition.type, value)
			}
		},
	}
}
