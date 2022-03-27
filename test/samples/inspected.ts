export type Coco<X> = {
	// x: X
	x: <Y = X>() => Y
	// CocoString: Coco<string>
}

export type Par<X> = Partial<{
	x: X
}>

export const z = "12"

export function callMe<A>(a1: A, a2: A) {}

// export type User = {
// 	name: string
// 	circular: Circular
// }

// export type Circular = {
// 	user: User
// }

// export function callMe<X>(x: X): X {
// 	return x
// }

// export class SuperCoco<A> {
// 	a!: A
// 	x: number
// 	static s = 12
// 	private p = 12

// 	constructor(a: A, b = 0, c?: string, ...other: string[]) {
// 		this.a = a
// 		this.x = 12
// 	}
// }

// export const SuperZabu = class<A> {
// 	a!: A
// 	x: number
// 	static s = 12

// 	constructor(a: A, b = 0, c?: string, ...other: string[]) {
// 		this.a = a
// 		this.x = 12
// 	}
// }

// namespace Zabu {
// 	export class CocoClass<A> {
// 		a!: A
// 		x: number

// 		constructor(a: A) {
// 			this.a = a
// 			this.x = 12
// 		}
// 	}

// 	export const ZabuClass = class {
// 		constructor(public z: number, t: number) {
// 			this.z = z + t
// 		}
// 	}
// }
