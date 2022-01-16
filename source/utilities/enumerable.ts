/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
export function enumerable(value: boolean) {
	return function (target: any, propertyKey: string) {
		const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {}
		descriptor.enumerable = value
		return descriptor
	}
}
