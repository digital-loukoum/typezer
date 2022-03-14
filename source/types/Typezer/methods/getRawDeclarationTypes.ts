import { Typezer } from "../Typezer"

/**
 * Find rawDeclaration.type from rawDeclaration.rawType
 */
export function getRawDeclarationTypes(this: Typezer) {
	this.rawDeclarations.forEach(rawDeclaration => {
		rawDeclaration.type = this.getRawDeclarationType(rawDeclaration)
	})
}
