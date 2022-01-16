/**
 * @returns a POJO from any value
 */
export function getPlainObject(value: any): unknown {
	if (!value || typeof value != "object") return value
	else if (Array.isArray(value)) {
		return value
			.filter(value => typeof value != "function")
			.map(item => getPlainObject(item))
	} else {
		const typeProperty: { type?: unknown } = {}
		const primitiveProperties: Record<string, unknown> = {}
		const objectProperties: Record<string, unknown> = {}

		for (const key in value) {
			const item = value[key]
			if (typeof item == "function") continue
			else if (key == "type") typeProperty.type = getPlainObject(item)
			else if (!item || typeof item != "object") {
				primitiveProperties[key] = item
			} else {
				objectProperties[key] = getPlainObject(item)
			}
		}

		return { ...typeProperty, ...primitiveProperties, ...objectProperties }
	}
}
