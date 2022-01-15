/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
export function enumerable(value: boolean) {
	return function (target: any, propertyKey: string) {
		let descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {}
		if (descriptor.enumerable != value) {
			descriptor.enumerable = value
			Object.defineProperty(target, propertyKey, descriptor)
		}
	}
}
