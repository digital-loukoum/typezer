import type ts from "typescript"

export function getOriginalBaseTypes(rawType: ts.Type): Array<ts.Type> {
	const baseTypes = rawType.getBaseTypes() ?? []

	// if no base type then the given type is an original base type (no ancestor)
	if (!baseTypes.length) return [rawType]
	// else we loop through the base types to find the original ones
	else {
		let originalBaseTypes: Array<ts.Type> = [rawType]
		for (const baseType of baseTypes) {
			originalBaseTypes = originalBaseTypes.concat(getOriginalBaseTypes(baseType))
		}
		return originalBaseTypes
	}
}
