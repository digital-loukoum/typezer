import print from "@digitak/print"
import { findManyDeclarations } from "../source"

const schema = findManyDeclarations({
	files: ["test/samples/inspected.ts"],
})

print`\n[underline:Schema]`
console.dir(schema, { depth: null })
