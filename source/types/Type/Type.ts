import { Properties } from "../Properties/Properties"
import { Signature } from "../Signature/Signature"

export type Type = Types[TypeName]
export type TypeName = keyof BaseTypes
export type Types = { [Key in TypeName]: { typeName: Key } & BaseTypes[Key] }

export type BaseTypes = {
	Void: {}
	Null: {}
	Undefined: {}
	StringLiteral: {
		value: string
	}
	TemplateLiteral: {
		texts: string[]
		types: ("string" | "number" | "bigint")[]
	}
	NumberLiteral: {
		value: number
	}
	BigIntegerLiteral: {
		value: string
	}
	BooleanLiteral: {
		value: boolean
	}
	Any: {}

	Boolean: {}
	Number: {}
	BigInteger: {}
	String: {}
	RegularExpression: {}
	Date: {}
	ArrayBuffer: {}

	Object: {
		properties: Properties
	}
	Record: {
		keys: Type
		items: Type
	}
	Map: {
		keys: Type
		items: Type
	}
	Array: {
		items: Type
	}
	Set: {
		items: Type
	}
	Tuple: {
		items: Type[]
	}
	Union: {
		items: Type[]
	}
	Enumeration: {
		items: Record<string, Type>
	}
	Function: {
		signatures: Signature[]
	}
	Class: {
		signatures: Signature[]
		properties: Properties
	}
	Reference: {
		id: string
	}
}
