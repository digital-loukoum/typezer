import { resolveTypeOfValue } from "../../utilities/resolveTypeOfValue.js"
import { serializeTemplateLiteral } from "../../utilities/serializeTemplateLiteral.js"
import { templateExpressions } from "../../utilities/templateExpressions.js"
import { isStringOrNumberLiteral } from "../Type/isStringOrNumberLiteral.js"
import { TypeName } from "../Type/TypeName.js"
import { Types } from "../Type/Types.js"
import { Validator } from "./Validator.js"

export function validators(this: Validator): {
	[Key in TypeName]: (type: Types[Key], value: any) => any
} {
	return {
		Any: () => {}, // never fails
		Unresolved: (type, value) => {
			let resolvedType = this.resolvedGenericsCache.get(type.uniqueId)
			if (resolvedType) this.validate(type, value)
			else this.resolvedGenericsCache.set(type.uniqueId, resolveTypeOfValue(value))
		},
		Unknown: () => {}, // never fails
		Never: (type, value) => this.mismatchValue(value, "never"), // always fails

		// references
		Reference: (type, value) => {},

		CircularReference: (type, value) => {
			this.validate(this.findParentReference(type.level), value)
		},

		// primitives
		Void: (type, value) => {
			if (value !== undefined) this.mismatchExact(value, undefined)
		},

		Null: (type, value) => {
			if (value !== null) this.mismatchExact(value, null)
		},

		Undefined: (type, value) => {
			if (value !== undefined) this.mismatchExact(value, undefined)
		},

		StringLiteral: (type, value) => {
			if (value !== type.value) this.mismatchExact(value, type.value)
		},

		TemplateLiteral: (type, value) => {
			if (typeof value !== "string") return this.mismatchValue(value, "a string")
			const { texts, types } = type
			let expression = texts[0]
			for (let i = 0; i < types.length; i++) {
				expression += templateExpressions[types[i]] + texts[i + 1]
			}
			if (!new RegExp(`^${expression}$`).test(value)) {
				this.mismatchValue(value, serializeTemplateLiteral(texts, types))
			}
		},

		NumberLiteral: (type, value) => {
			if (value !== type.value) this.mismatchExact(value, type.value)
		},

		BigIntegerLiteral: (type, value) => {
			// console.log("BIGINT!", type, value)
			// return true
			if (value !== BigInt(type.value)) this.mismatchExact(value, type.value)
		},

		BooleanLiteral: (type, value) => {
			if (value !== type.value) this.mismatchExact(value, type.value)
		},

		// --    PRIMITIVES    -- //
		Boolean: (type, value) => {
			if (typeof value !== "boolean") this.mismatchValue(value, "a boolean")
		},

		Number: (type, value) => {
			if (typeof value !== "number") this.mismatchValue(value, "a number")
		},

		BigInteger: (type, value) => {
			if (typeof value !== "bigint") this.mismatchValue(value, "a big integer")
		},

		String: (type, value) => {
			if (typeof value !== "string") this.mismatchValue(value, "a string")
		},

		RegularExpression: (type, value) => {
			if (!(value instanceof RegExp)) this.mismatchValue(value, "a regular expression")
		},

		Date: (type, value) => {
			if (!(value instanceof Date)) this.mismatchValue(value, "a date")
		},

		ArrayBuffer: (type, value) => {
			if (!(value instanceof ArrayBuffer)) this.mismatchValue(value, "an array buffer")
		},

		Symbol: (type, value) => {
			if (typeof value != "symbol") this.mismatchValue(value, "a symbol")
		},

		// --    COMPOSABLES    -- //
		Promise: (type, value) => {
			this.validate(type.item, value)
		},

		Object: (type, value) => {
			if (!value || typeof value !== "object") this.mismatchValue(value, "an object")
			else {
				for (const key in type.properties) {
					this.path.push(key)
					this.validate(type.properties[key], value[key])
					this.path.pop()
				}
			}
		},

		Namespace: (type, value) => {
			if (!value || typeof value !== "object") this.mismatchValue(value, "an object")
			else {
				for (const key in type.properties) {
					this.path.push(key)
					this.validate(type.properties[key], value[key])
					this.path.pop()
				}
			}
		},

		Class: (type, value) => {
			if (!value || typeof value !== "object") this.mismatchValue(value, "an object")
			else {
				for (const key in type.properties) {
					const property = type.properties[key]
					if (property.modifiers?.includes("static")) continue
					this.path.push(key)
					this.validate(type.properties[key], value[key])
					this.path.pop()
				}
			}
		},

		Record: (type, value) => {
			if (!value || typeof value !== "object") this.mismatchValue(value, "an record")
			else {
				let keysType = type.keys
				const literals: (Types["NumberLiteral"] | Types["StringLiteral"])[] = []
				if (isStringOrNumberLiteral(keysType)) {
					literals.push(keysType)
				} else if (keysType.typeName == "Union") {
					literals.push(...keysType.items.filter(isStringOrNumberLiteral))
				} else if (keysType.typeName == "Enumeration") {
					literals.push(...Object.values(keysType.items).filter(isStringOrNumberLiteral))
				}

				for (const key in value) {
					this.path.push(key)
					this.validate(type.keys, key)
					this.validate(type.items, value[key])
					this.path.pop()
				}

				// every literal value found in the key type must be present in the record
				for (const literal of literals) {
					if (!(literal.value in value)) {
						this.missing(String(literal.value))
					}
				}
			}
		},

		Array: (type, value) => {
			if (!Array.isArray(value)) this.mismatchValue(value, "an array")
			else {
				value.forEach((item, index) => {
					this.path.push(String(index))
					this.validate(type.items, item)
					this.path.pop()
				})
			}
		},

		Tuple: (type, value) => {
			if (!Array.isArray(value)) this.mismatchValue(value, "a tuple")
			else if (value.length != type.items.length)
				this.mismatchValue(value, `a tuple with ${type.items.length} elements`)
			else {
				type.items.forEach((type, index) => {
					this.path.push(String(index))
					this.validate(type, value[index])
					this.path.pop()
				})
			}
		},

		Map: (type, value) => {
			if (!(value instanceof Map)) this.mismatchValue(value, "a map")
			else {
				for (const [key, item] of value.entries()) {
					this.path.push(!key || typeof key != "object" ? String(key) : "")
					this.validate(type.keys, key)
					this.validate(type.items, item)
					this.path.pop()
				}
			}
		},

		Set: (type, value) => {
			if (!(value instanceof Set)) this.mismatchValue(value, "a set")
			else {
				this.path.push("")
				for (const key of value) {
					this.validate(type.items, key)
				}
				this.path.pop()
			}
		},

		Union: (type, value) => {
			for (const subtype of type.items) {
				const check = this.fork().validate(subtype, value)
				if (!check.errors.length) return
			}
			this.mismatchValue(value, type.toString())
		},

		Enumeration: (type, value) => {
			for (const subtype of Object.values(type.items)) {
				const check = this.fork().validate(subtype, value)
				if (!check.errors.length) return
			}
			this.mismatchValue(value, type.toString())
		},

		Function: (type, value) => {
			if (typeof value !== "function") this.mismatchValue(value, "a function")
		},
	}
}
