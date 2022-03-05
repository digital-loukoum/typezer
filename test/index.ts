import { Typezer } from "../source"
import { print } from "@digitak/print"
import { definitions } from "../source/types/Definition/definitions"
import { validate } from "../source/validate"

const typezer = new Typezer(["test/samples/checkExportedTypes.ts"])

print`[bold.green:----------------]`

const declarations = typezer.getAllDeclarations()
console.dir(declarations, { depth: null })

print` `
print`[bold:[ [yellow: Definitions] ]]`
console.dir(definitions, { depth: 99 })

print` `
print`[bold:[ [yellow: Validation] ]]`
console.dir(
	validate(declarations[0].value.toPlainObject() as any, { x: 125, y: "5321" }),
	{ depth: 99 }
)
