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

	BigInteger: BigInteger
	RegularExpression: RegExp
	Date: Date
	ArrayBuffer: ArrayBuffer
}

export type PartialPrimitives = Partial<Primitives>

export type Literals = {
	number: 12
	string: "12"
	bigInt: 12n
	boolean: true
}

enum NumberEnumeration {
	a,
	b,
}

enum StringEnumeration {
	a = "a",
	b = "b",
}

type CircularReference = {
	primitives: Primitives
	self: CircularReference
}

export type Containers = {
	object: Primitives
	arrayOfNumbers: Array<number>
	arrayOfPrimitives: Array<Primitives>
	recordOfNumbers: Record<string, number>
	recordOfNumbersWithLiteralKeys: Record<"12" | "15", number>
	tuple: [1, "2", Primitives]
	mapStringNumber: Map<string, number>
	mapNumberString: Map<number, string>
	mapLiteralsPrimitives: Map<12 | "string" | Literals, Primitives>
	setOfNumber: Set<number>
	setOfPrimitives: Set<Primitives>
	setOfLiterals: Set<12 | "string">
	union: 12 | "string" | Primitives
	enumerationNumber: NumberEnumeration
	enumerationString: StringEnumeration
	function: (number: number, string: string, primitives: Primitives) => number
	class: new (number: number, string: string, primitives: Primitives) => number
	reference: CircularReference
}
