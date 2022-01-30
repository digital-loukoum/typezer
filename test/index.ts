import { Typezer } from "../source"
import { print } from "@digitak/print"
import { definitions } from "../source/types/Definition/definitions"

const typezer = new Typezer(["test/samples/checkExportedTypes.ts"])

print`[bold.green:----------------]`

const declarations = typezer.getAllDeclarations()
console.dir(declarations, { depth: null })

print`[bold.green:----------------]`
print`[bold:[ [yellow: Definitions] ]]`
console.dir(definitions, { depth: 99 })
