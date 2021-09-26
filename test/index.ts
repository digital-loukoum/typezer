import Typezer from "../source"
import print from "cute-print"

const typezer = new Typezer("test/samples/checkExportedTypes.ts")

print`[bold.green:----------------]`

typezer.sourceFiles.forEach((sourceFile, index) => {
	print`${index ? "\n" : ""}[bold:[ [blue: ${sourceFile.name}] ]]`
	console.log(sourceFile.getExportedValues())

	// sourceFile.getTypeDeclarations().forEach((typeDeclaration, index) => {
	// 	print`${index ? "\n" : ""}[magenta]- ${typeDeclaration.name}`
	// 	console.log(typeDeclaration.getProperties())
	// })
})

print`[bold.green:----------------]`
