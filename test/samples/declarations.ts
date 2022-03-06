export class Class {
	x = 0
	y = "12"
	nested = {
		z: 0,
	}
	constructor(value: number) {
		this.x = value
	}
}

export type TypeAlias = Class

export type Type = {
	x: number
	y: "12"
	nested: {
		z: 0
	}
}

export interface Interface {
	x: number
	y: "12"
	nested: {
		z: 0
	}
}

export const Variable = 12

export function fun(x: number, y: string, nested: { z: number }): number {
	return x
}

export { Variable as AliasVariable }
