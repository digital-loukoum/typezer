export type Primitives = {
	void: void
	null: null
	undefined: undefined
	number: number
	Number: Number
	string: string
	String: String
	symbol: symbol
	Symbol: Symbol
	boolean: boolean
	Boolean: Boolean
	BigInteger: BigInt
	RegularExpression: RegExp
	Date: Date
	ArrayBuffer: ArrayBuffer
}

export type PartialPrimitives = Partial<Primitives>

export type { Alias } from "~samples/Alias.js"

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
	static static = 12
}

export type Arrays = {
	Number: Array<number>
	Object: Array<Primitives>
}

export type Promises = {
	Number: Promise<number>
	Object: PromiseLike<Primitives>
}

export type Records = {
	String_Number: Record<string, number>
	String_String: Record<string, string>
	Union_String: Record<"12" | "15", string>
	Never_Any: Record<never, any>
}

export type Tuples = {
	NumberLiteral_StringLiteral_Object: [1, "2", Primitives]
	String_StringLiteral_String_Number_Object: [string, "1", String, Number, Primitives]
}

export type Maps = {
	String_Number: Map<string, number>
	Number_String: Map<number, string>
	Union_Object: Map<12 | "string", Primitives>
}

export type Sets = {
	Number: Set<number>
	Object: Set<Primitives>
	NumberLiteral: Set<12>
	Union: Set<12 | "12">
}

export type Unions = {
	NumberLiteral_StringLiteral_Object: 12 | "string" | Primitives
	Number_String: Number | string
}

export type Enumerations = {
	enumerationNumber: NumberEnumeration
	enumerationString: StringEnumeration
}

export type Functions = {
	Function_Number: () => number
	Function_String: () => String
}

export const Constructor = class {
	static Number = 12
	static String = "12"
	constructor(public Number: number, public String: string) {}
}

export type Constructors = {
	Class_1_String: new (_: string) => any
	Class_1_Number_Union: new (_1: number, _2?: string) => any
	Class_0_Union_Union: new (_1?: number, _2?: string) => any
}

export class Class {
	static static = 12
	notStatic = 12
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
