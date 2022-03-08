import { Typezer } from "../source"

const typezer = new Typezer(["test/samples/inspected.ts"])
const { definitions } = typezer
const declarations = typezer.getAllDeclarations()
console.log("Definitions")
console.dir(definitions, { depth: null })
console.log("Declarations")
console.dir(declarations, { depth: null })
