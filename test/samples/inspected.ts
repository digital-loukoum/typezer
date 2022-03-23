// export type Circular_1<C1> = {
// 	self<C2 = C1>(): Circular_1<C2>
// }

namespace Zabu {
	export type CocoType<A extends string> = { x: number; a: A }

	export type CocoTypePartial<A extends string> = Partial<{ x: number; a: A }>
	export interface CocoInterface<A extends string> {
		a: A
	}

	export function CocoFunction<A>(a: A): A {
		return a
	}

	export class CocoClass<A> {
		a!: A
	}
}
