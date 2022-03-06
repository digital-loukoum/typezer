import { Typezer } from "../source"
import { print } from "@digitak/print"
import start from "fartest"

start("Declarations", async ({ stage, test, same }) => {
	const typezer = new Typezer(["test/samples/declarations.ts"])
	const declarations = typezer.getAllDeclarations()
	print`[bold:[ [yellow: Declarations] ]]`
	console.dir(declarations, { depth: null })
	print`[bold:[ [yellow: Definitions] ]]`
	console.dir(typezer.definitions, { depth: null })
})
