import print from "@digitak/print"
import { getAllDeclarations } from "../source"

const { definitions, declarations } = getAllDeclarations(["test/samples/inspected.ts"])

print`\n[underline:Definitions]`
console.dir(definitions, { depth: null })

print`\n[underline:Declarations]`
console.dir(declarations, { depth: null })
