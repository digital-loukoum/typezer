import { Typezer } from "../source"
import { print } from "@digitak/print"
import { definitions } from "../source/types/Definition/definitions"

const typezer = new Typezer("test/samples/checkExportedTypes.ts")

print`[bold.green:----------------]`

typezer.sourceFiles.forEach((sourceFile, index) => {
	try {
		print`${index ? "\n" : ""}[bold:[ [blue: ${sourceFile.name}] ]]`
		const exportedTypes = sourceFile.getTypeDeclarations()

		for (const key in exportedTypes) {
			print`[bold:${key}:]`
			console.dir(exportedTypes[key], {
				depth: 999,
			})
			// console.log(exportedTypes[key].value.toJson())
		}
	} catch (error) {
		console.log(error)
	}
})

print`[bold.green:----------------]`
print`[bold:[ [yellow: Definitions] ]]`
console.dir(definitions, { depth: 99 })
