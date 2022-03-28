# <a name="top"></a> Typezer
Parse Typescript files and retrieve a synthetic description of 
defined types and variables

Typezer is a high-level wrapper around the [Typescript compiler api](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API) that focuses on extracting the types of a typescript file.

This library also come with a subpackage dedicated to validate a value against a type previously extracted.

## <a name="why"></a> Why?

This library is similar to projects like [ts-json-schema-generator](https://github.com/vega/ts-json-schema-generator) but aims to deal with all cases imaginable. In particular, these types are not handled correctly by `ts-json-schema-generator`:

- `functions` are treated as `objects`,
- `records` and mapped types are ignored.

Also, the schema output of Typezer is cleaner, more readable and more powerful than json schema specifications, that cannot deal with things like circular definitions.

A big difference between Typezer and other libraries is that Typezer *does not rely on type name* to detect the true type. Concretely, it means that that kind of code:

```ts
type string = number
let notAString: string = 12
```

will result with `notAString` being a `string` for some other libraries but a `number` for Typezer.

Instead of name detection, Typezer uses *feature detection* to make sure that all variables are assigned to their true types.

### When to use it

You can use Typezer when you need to do meta-programming with Typescript. A typical example is when you need to generate Typescript code - or anything else - from Typescript source code.

Some use cases:

- you create your backend API with Typescript and would like to reuse your type definitions to validate input from the client;
- you are creating an ORM and would like to use Typescript types to define your database schema;
- you need to extract the types for writing an automatic documentation;
- etc...

## <a name="features"></a> Features

The following types are handled by Typezer:

✓ Never
✓ Any
✓ Null
✓ Undefined
✓ Void
✓ NumberLiteral
✓ StringLiteral
✓ TemplateLiteral
✓ BooleanLiteral
✓ BigIntegerLiteral
✓ Number
✓ String
✓ Boolean
✓ Symbol
✓ BigInteger
✓ RegularExpression
✓ Date
✓ ArrayBuffer
✓ Promise
✓ Object
✓ Namespace
✓ Class
✓ Array
✓ Set
✓ Tuple
✓ Union
✓ Record
✓ Map
✓ Enumeration
✓ Function

Also, Typezer correctly handles:

✓ Property modifiers (static, readonly, optionals, ...)
✓ Circular references
✓ Generics (but not the special case of circular generics; see [limitations](#limitations))
✓ Generic constraints
✓ Watching type changes

## <a name="api"></a> API

This library exports three high-level functions:

```ts
import {
  findDeclaration,
  findAllDeclarations,
  watchDeclarations
} from "typezer"

function findDeclaration(
	symbol: string, // name of the declaration
	options: Omit<TypezerOptions, "symbols"> // additional options
): {
  declaration: Declaration
  schema: Record<string, Declaration>
}
 
function findManyDeclarations(
	options: TypezerOptions
): Record<string, Declaration>
 
 
function watchDeclarations(
	options: TypezerOptions & { onChange: WatcherCallback }
): Record<string, Declaration>
```

See the type definitions of [Declaration](#type-declaration) and [TypezerOptions](#type-typezer-options) below 👇

### Example

Let `sample.ts` be a Typescript file that we want to parse:

```ts
// ./sample.ts
const foo = 123

export type Bar = {
  someNumber: number
  someString: string
}
```

Then we can retrieve the types of top-level declarations very easily with Typezer:

```ts
import { findManyDeclarations } from "typezer"

const schema = findManyDeclarations({
  files: ["./sample.ts"]
})

console.log("schema:", schema)
```

This should print:

```ts
schema: {
  foo: {
    id: 'foo',
    name: 'foo',
    fileName: '/full/path/to/sample.ts',
    declare: 'variable',
    exportedAs: [], // not exported
    typeName: 'NumberLiteral',
    value: 123
  },
  Bar: {
    id: 'Bar',
    name: 'Bar',
    fileName: '/full/path/to/sample.ts',
    declare: 'type',
    exportedAs: [ 'Bar' ],
    typeName: 'Object',
    properties: {
      someNumber: { typeName: 'Number' },
      someString: { typeName: 'String' }
    }
  }
}
```

### Watching

It is possible to watch type changes. Typezer will create a dependency tree and update the schema whenever a dependency changes.

```ts
import { watchDeclarations } from "typezer"

watchDeclarations({
  files: ["./sample.ts"],
  onChange: (schema) => {
    // executed at startup then every time a change happens
    console.log("schema:", schema)
  }
})
```


## <a name="validation"></a> Validation API

Given a schema and a type inside this schema, Typezer exports a submodule to validate any value against this type.

```ts
import { validateType } from "typezer/validate"

function validateType(
  schema: Record<string, Declaration>,
  type: Type, // the type to test the value
  value: unknown // the value to test
): Array<string> // errors raised
```

### Example

```ts
import { findManyDeclarations } from "typezer"
import { validateType } from "typezer/validate"

const schema = findManyDeclarations({
  files: ["./sample.ts"]
})

let errors: Array<string>

// no errors - 123 matches the number literal 123
errors = validateType(schema, "foo", 123)
console.log("Errors:", errors)

// errors - 200 does not match the number literal 123
errors = validateType(schema, "foo", 200)
console.log("Errors:", errors)

// no errors - someNumber matches a number and someString matches a string
errors = validateType(schema, "Bar", {
  someNumber: 123,
  someString: "123",
})

// you can validate a subtype by using an array to describe the path
errors = validateType(schema, ["Bar", "someNumber"], 123)
errors = validateType(schema, ["Bar", "someString"], 123)
```
### Validating a signature

It is also possible to validate a function signature.

Example:

```ts
// ./sample.ts
function foo(someNumber: number, someString: string): string {
	...
}
```

```ts
import { findManyDeclarations } from "typezer"
import { validateSignature } from "typezer/validate"

const schema = findManyDeclarations({
  files: ["./sample.ts"]
})

const { errors, returnType } = validateSignature(
	schema,
	"foo",
	[123, "123"] // parameters: one number then one string
)

console.log(errors) // []
console.log(returnType) // { typeName: "String" }
```

If several signatures are declared for a function, the return type will be the one of the first signature that match the parameters.

## <a name="limitations"></a> Limitations

There is one particular edge case where Typezer will crash: the mighty `circular generics`. It happens when you have a generic function inside a generic type that has a circular reference to the parent generic type.

A concrete example:

```ts
type Foo<T1> = {
  foo: <T2 = T1>() => T2
}
```

> Note that generics must be constraint-less for the bug to happen. If you add a constraint to X or Y, Typezer will be able to guess the right types.

The TS compiler API makes it very hard to deal with this kind of situation, so for now it is left as a known bug, but there will be efforts in the future to address this case.


### Types

#### <a name="type-typezer-options"></a> `TypezerOptions`

```ts
type TypezerOptions = {
	files?: string[] // globs of files to look declarations in
	symbols?: string[] // globs of symbol names to match
	compilerOptions?: ts.CompilerOptions // custom ts compiler options
}
```

#### <a name="type-declaration"></a> `Declaration`

```ts
type Declaration = Type & {
	id: string
	declare:
		| "namespace"
		| "enumeration"
		| "class"
		| "interface"
		| "type"
		| "variable"
		| "function"
		| "default"
	fileName: string
	name: string
	exportedAs: string[]
}
```

#### <a name="type-type"></a> `Type`

```ts
type Type =
  // -- primitives --
	| { typeName: "Unknown" }
	| { typeName: "Never" }
	| { typeName: "Void" }
	| { typeName: "Any" }
	| { typeName: "Boolean" }
	| { typeName: "Number" }
	| { typeName: "BigInteger" }
	| { typeName: "String" }
	| { typeName: "Symbol" }
	| { typeName: "RegularExpression" }
	| { typeName: "Date" }
	| { typeName: "ArrayBuffer" }

  // -- literals --
	| { typeName: "Null" }
	| { typeName: "Undefined" }
	| {
			typeName: "StringLiteral"
			value: string
	  }
	| {
			typeName: "TemplateLiteral"
			texts: string[]
			types: ("string" | "number" | "bigint")[]
	  }
	| {
			typeName: "NumberLiteral"
			value: number
	  }
	| {
			typeName: "BigIntegerLiteral"
			value: string
	  }
	| {
			typeName: "BooleanLiteral"
			value: boolean
	  }

  // -- objects --
  | {
			typeName: "Namespace"
			properties: Properties
	  }
	| {
			typeName: "Object"
			properties: Properties
	  }
	| {
			typeName: "Promise"
			item: Type
	  }
	| {
			typeName: "Record"
			keys: Type
			items: Type
	  }
	| {
			typeName: "Map"
			keys: Type
			items: Type
	  }
	| {
			typeName: "Array"
			items: Type
	  }
	| {
			typeName: "Set"
			items: Type
	  }
	| {
			typeName: "Tuple"
			items: Type[]
	  }
	| {
			typeName: "Union"
			items: Type[]
	  }
	| {
			typeName: "Enumeration"
			items: Record<string, Type>
	  }
	| {
			typeName: "Function"
			signatures: Signature[]
	  }
	| {
			typeName: "Class"
			staticProperties: Properties
			properties: Properties
			signature?: Constructor
	  }

  // -- others --
	| {
			typeName: "CircularReference"
			level: number // level of the parent
	  }
	| {
			typeName: "Unresolved" // constraint-less generic
			uniqueId: number // unique id to identify the generic
	  }
```