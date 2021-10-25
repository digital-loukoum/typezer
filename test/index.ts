import Typezer from "../source"
import print from "cute-print"
import { inspect } from "util"

const typezer = new Typezer("test/samples/checkExportedTypes.ts")

print`[bold.green:----------------]`

typezer.sourceFiles.forEach((sourceFile, index) => {
	print`${index ? "\n" : ""}[bold:[ [blue: ${sourceFile.name}] ]]`
	const exportedTypes = sourceFile.getExportedValueTypes()

	for (const key in exportedTypes) {
		print`[bold:${key}:]`
		console.dir(exportedTypes[key].toProperty(), {
			depth: 999,
		})
	}
	// console.log(sourceFile.getExportedValueTypes().map(node => node.getText()))

	// sourceFile.getTypeDeclarations().forEach((typeDeclaration, index) => {
	// 	print`${index ? "\n" : ""}[magenta]- ${typeDeclaration.name}`
	// 	console.log(typeDeclaration.getProperties())
	// })
})

print`[bold.green:----------------]`
