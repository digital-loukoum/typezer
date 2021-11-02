type Generic<T> = {
	x: T
	y: T
	// generic?: Generic<T>
	// nogeneric?: NoGeneric

	zabu: () => void
}

type NoGeneric = {
	x: number
	generic?: Generic<string>
}

// export const generic: Generic<string> = {
// 	x: "12",
// 	y: "12",
// 	// nogeneric: {
// 	// 	x: 52,
// 	// },
// }

// export const nogeneric: NoGeneric = {
// 	x: 12,
// 	generic: {
// 		x: "22",
// 		y: "12",
// 	},
// }

// export const x = () => 1
// export const y = x
// export function z(x: NoGeneric): void {}
// export const t = z
// export const zaze = 12

export let n: Generic<number>

interface Coco {
	x: string
}

let c: Coco

enum Zabu {
	X,
	Y,
}
