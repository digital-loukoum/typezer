import Typezer from "../source"
import print from "cute-print"

const typezer = new Typezer("test/samples/checkExportedTypes.ts")

print`[bold.green:----------------]`

typezer.sourceFiles.forEach((sourceFile, index) => {
	print`${index ? "\n" : ""}[bold:[ [blue: ${sourceFile.name}] ]]`
	const exportedTypes = sourceFile.getTypeDeclarations()

	for (const key in exportedTypes) {
		print`[bold:${key}:]`
		console.dir(exportedTypes[key], {
			depth: 999,
		})
	}
})

print`[bold.green:----------------]`
