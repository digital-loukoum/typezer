import type ts from "typescript"

type IndexInfo = {
	keyType: ts.Type
	type: ts.Type
}

/**
 * @returns the subtype of the array if it is an array, null otherwise
 */
export function getMappedType(
	type: ts.Type
): [key: ts.Type[], value: ts.Type] | undefined {
	const indexInfos: IndexInfo[] = (type as any).indexInfos

	if (indexInfos) {
		let key: ts.Type[] = []
		let value: ts.Type | undefined = undefined

		for (const { keyType, type } of indexInfos) {
			key.push(keyType)
			value = type
		}

		if (key.length && value) return [key, value]
	}
}
