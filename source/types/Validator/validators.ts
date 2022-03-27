import { serializeTemplateLiteral } from "../../utilities/serializeTemplateLiteral"
import { templateExpressions } from "../../utilities/templateExpressions"
import { isStringOrNumberLiteral } from "../Type/isStringOrNumberLiteral"
import { TypeName } from "../Type/TypeName"
import { Types } from "../Type/Types"
import { Validator } from "./Validator"

export function validators(this: Validator): {
	[Key in TypeName]: (type: Types[Key], value: any) => any
} {
	return {
		Any: () => {}, // never fails
		Unresolved: () => {}, // TODO: add info about the generic when meeting for the first time
		Unknown: () => {}, // never fails
		Never: (type, value) => this.mismatch(value, "never"), // always fails

		// references
		Reference: (type, value) => {},

		CircularReference: (type, value) => {
			this.validate(this.findParentReference(type.level), value)
		},

		// primitives
		Void: (type, value) => {
			if (value !== undefined) this.mismatch(value, "undefined")
		},

		Null: (type, value) => {
			if (value !== null) this.mismatch(value, "null")
		},

		Undefined: (type, value) => {
			if (value !== undefined) this.mismatch(value, "undefined")
		},

		StringLiteral: (type, value) => {
			if (value !== type.value) this.mismatch(value, type.value)
		},

		TemplateLiteral: (type, value) => {
			if (typeof value !== "string") return this.mismatch(value, "a string")
			const { texts, types } = type
			let expression = texts[0]
			for (let i = 0; i < types.length; i++) {
				expression += templateExpressions[types[i]] + texts[i + 1]
			}
			if (!new RegExp(`^${expression}$`).test(value)) {
				this.mismatch(value, serializeTemplateLiteral(texts, types))
			}
		},

		NumberLiteral: (type, value) => {
			if (value !== type.value) this.mismatch(value, type.value)
		},

		BigIntegerLiteral: (type, value) => {
			if (value !== BigInt(type.value)) this.mismatch(value, type.value)
		},

		BooleanLiteral: (type, value) => {
			if (value !== type.value) this.mismatch(value, type.value)
		},

		// --    PRIMITIVES    -- //
		Boolean: (type, value) => {
			if (typeof value !== "boolean") this.mismatch(value, "a boolean")
		},

		Number: (type, value) => {
			if (typeof value !== "number") this.mismatch(value, "a number")
		},

		BigInteger: (type, value) => {
			if (typeof value !== "bigint") this.mismatch(value, "a big integer")
		},

		String: (type, value) => {
			if (typeof value !== "string") this.mismatch(value, "a string")
		},

		RegularExpression: (type, value) => {
			if (!(value instanceof RegExp)) this.mismatch(value, "a regular expression")
		},

		Date: (type, value) => {
			if (!(value instanceof Date)) this.mismatch(value, "a date")
		},

		ArrayBuffer: (type, value) => {
			if (!(value instanceof ArrayBuffer)) this.mismatch(value, "an array buffer")
		},

		Symbol: (type, value) => {
			if (typeof value != "symbol") this.mismatch(value, "a symbol")
		},

		// --    COMPOSABLES    -- //
		Promise: (type, value) => {
			this.validate(type.item, value)
		},

		Object: (type, value) => {
			if (!value || typeof value !== "object") this.mismatch(value, "an object")
			else {
				for (const key in type.properties) {
					this.path.push(key)
					this.validate(type.properties[key], value[key])
					this.path.pop()
				}
			}
		},

		Namespace: (type, value) => {
			if (!value || typeof value !== "object") this.mismatch(value, "an object")
			else {
				for (const key in type.properties) {
					this.path.push(key)
					this.validate(type.properties[key], value[key])
					this.path.pop()
				}
			}
		},

		Class: (type, value) => {
			if (!value || typeof value !== "object") this.mismatch(value, "an object")
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
			if (!value || typeof value !== "object") this.mismatch(value, "an record")
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
			if (!Array.isArray(value)) this.mismatch(value, "an array")
			else {
				value.forEach((item, index) => {
					this.path.push(String(index))
					this.validate(type.items, item)
					this.path.pop()
				})
			}
		},

		Tuple: (type, value) => {
			if (!Array.isArray(value)) this.mismatch(value, "a tuple")
			else if (value.length != type.items.length)
				this.mismatch(value, `a tuple with ${type.items.length} elements`)
			else {
				type.items.forEach((type, index) => {
					this.path.push(String(index))
					this.validate(type, value[index])
					this.path.pop()
				})
			}
		},

		Map: (type, value) => {
			if (!(value instanceof Map)) this.mismatch(value, "a map")
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
			if (!(value instanceof Set)) this.mismatch(value, "a set")
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
			this.mismatch(value, type.toString())
		},

		Enumeration: (type, value) => {
			for (const subtype of Object.values(type.items)) {
				const check = this.fork().validate(subtype, value)
				if (!check.errors.length) return
			}
			this.mismatch(value, type.toString())
		},

		Function: (type, value) => {
			if (typeof value !== "function") this.mismatch(value, "a function")
		},
	}
}
