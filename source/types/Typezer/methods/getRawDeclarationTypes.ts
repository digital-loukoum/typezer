import { Typezer } from "../Typezer"

/**
 * Find rawDeclaration.type from rawDeclaration.rawType
 */
export function getRawDeclarationTypes(this: Typezer) {
	this.rawDeclarations.forEach(rawDeclaration => {
		// console.log(
		// 	"Getting raw declaration",
		// 	rawDeclaration.fileName,
		// 	":",
		// 	rawDeclaration.name
		// )
		rawDeclaration.type = this.getRawDeclarationType(rawDeclaration)
	})
}
