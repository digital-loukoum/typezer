# Typezer
Parse Typescript files and retrieve a synthetic description of 
defined types and variables

Typezer is a high-level wrapper around the [Typescript compiler api](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API) that focuses on extracting the types of a typescript file.

This library also come with a subpackage dedicated to validate a value against a type previously extracted.

## Why?

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

## Features

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
✓ Generics
✓ Generic constraints
✓ Circular generics

## API

### Low-level API

### Types

## Validation API