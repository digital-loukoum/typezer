export type Primitives = {
	void: void
	null: null
	undefined: undefined
	number: number
	Number: Number
	string: string
	String: String
	boolean: boolean
	Boolean: Boolean
	BigInteger: BigInt
	RegularExpression: RegExp
	Date: Date
	ArrayBuffer: ArrayBuffer
}

export type PartialPrimitives = Partial<Primitives>

export type Literals = {
	numberLiteral: 12
	stringLiteral: "12"
	templateLiteral: `${number}px`
	bigIntegerLiteral: 12n
	booleanLiteral: true
}

export abstract class Modifiers {
	readonly readonly = 12
	public public = 12
	protected protected = 12
	private private = 12
	abstract abstract: number
}

export type Arrays = {
	Number: Array<number>
	Reference: Array<Primitives>
}

export type Records = {
	String_Number: Record<string, number>
	String_String: Record<string, string>
	Union_String: Record<"12" | "15", string>
}

export type Tuples = {
	NumberLiteral_StringLiteral_Reference: [1, "2", Primitives]
	String_StringLiteral_String_Number_Reference: [string, "1", String, Number, Primitives]
}

export type Maps = {
	String_Number: Map<string, number>
	Number_String: Map<number, string>
	Union_Reference: Map<12 | "string", Primitives>
}

export type Sets = {
	Number: Set<number>
	Reference: Set<Primitives>
	NumberLiteral: Set<12>
	Union: Set<12 | "12">
}

export type Unions = {
	NumberLiteral_StringLiteral_Reference: 12 | "string" | Primitives
	Number_String: Number | string
}

export type Enumerations = {
	enumerationNumber: NumberEnumeration
	enumerationString: StringEnumeration
}

export type Functions = {
	Function_Number: () => number
	Class_String: new () => String
}

export type CircularReference = {
	primitives: Primitives
	self: CircularReference
}

// utility types
enum NumberEnumeration {
	$0,
	$1,
	$99 = 99,
}

enum StringEnumeration {
	a = "a",
	b = "b",
}
