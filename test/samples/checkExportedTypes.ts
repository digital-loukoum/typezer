type Generic<T> = {
	x: T
	y: T
	// generic?: Generic<T>
	// nogeneric?: NoGeneric
}

type NoGeneric = {
	x: number
	generic?: Generic<string>
}

export const generic: Generic<string> = {
	x: "12",
	y: "12",
	// nogeneric: {
	// 	x: 52,
	// },
}

export const nogeneric: NoGeneric = {
	x: 12,
	generic: {
		x: "22",
		y: "12",
	},
}
