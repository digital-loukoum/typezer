export class Coco<T> {
	constructor(public name: T) {}
}

interface I {
	z: number
}
export type T = I
export interface EI {}

export function noot() {}

const obj = { a: 121 }
let x = 12
const y = 12
x = 11
let anyy: any = 12
const Yell = () => ({})
const coco = new Coco("aze")
const yell = Yell()

export { anyy, x as xxx, y, yell, Yell, obj, coco, I }

export var zaz = {}
export const z = 121
export let t = 31,
	w = "dza"

export const Attack = () => {}

export default new Coco(231)
