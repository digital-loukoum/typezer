type Generic<T> = {
	x: T
	y: T
	// generic?: Generic<T>
	// nogeneric?: NoGeneric

	// zabu: () => void
}

export class Coco {
	x = "aazd"
	generic: Generic<string> = {
		x: "12",
		y: "212",
	}
}

export type NoGeneric = {
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
