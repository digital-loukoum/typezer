import { Properties } from "../Properties/Properties.js"
import { Constructor } from "../Signature/Constructor.js"
import { Signature } from "../Signature/Signature.js"
import { Type } from "./Type.js"

export type Types = {
	[Key in keyof BaseTypes]: {
		typeName: Key
	} & BaseTypes[Key]
}

export type BaseTypes = {
	Unresolved: {
		// generic type to be resolved
		uniqueId: number // unique id to identify the generic
	}
	Unknown: {}
	Never: {}
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
	Symbol: {}
	RegularExpression: {}
	Date: {}
	ArrayBuffer: {}

	Namespace: {
		properties: Properties
	}
	Object: {
		properties: Properties
	}
	Promise: {
		item: Type
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
		staticProperties: Properties
		properties: Properties
		signature?: Constructor
	}
	Reference: {
		id: string
		typeParameters?: Type[]
	}
	CircularReference: {
		level: number
	}
}
