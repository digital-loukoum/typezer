import type ts from "typescript"

export function getOriginalBaseTypes(type: ts.Type): Array<ts.Type> {
	const baseTypes = type.getBaseTypes() ?? []

	// if no base type then the given type is an original base type (no ancestor)
	if (!baseTypes.length) return [type]
	// else we loop through the base types to find the original ones
	else {
		let originalBaseTypes: Array<ts.Type> = []
		for (const baseType of baseTypes) {
			originalBaseTypes = originalBaseTypes.concat(getOriginalBaseTypes(baseType))
		}
		return originalBaseTypes
	}
}
