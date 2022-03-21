import ts from "typescript"

/**
 * Check if the given list of property names match the given list of feature names.
 * We only check for names as checking many feature names is much likely enough to be quite certain about a type
 */
export function typeMatchFeatures(type: ts.Type, ...features: string[][]) {
	const properties = type.getProperties().map(symbol => symbol.name)

	nextFeaturesFamily: for (const featuresFamily of features) {
		for (const feature of featuresFamily) {
			if (!properties.includes(feature)) continue nextFeaturesFamily
		}
		return true
	}
	return false
}
