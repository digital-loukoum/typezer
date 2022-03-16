import { Path } from "../Path/Path"
import { Properties } from "../Properties/Properties"
import { Signature } from "../Signature/Signature"
import { Type } from "./Type"

export type Types = {
	[Key in keyof BaseTypes]: {
		typeName: Key
		generics?: Record<string, Type>
	} & BaseTypes[Key]
}

export type BaseTypes = {
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
	RegularExpression: {}
	Date: {}
	ArrayBuffer: {}

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
		signatures: Signature[]
		properties: Properties
	}
	Reference: {
		path: Path
		typeParameters?: Type[]
	}
}
