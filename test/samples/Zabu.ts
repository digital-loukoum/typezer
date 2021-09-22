import { Coco } from "./Coco"

// class Zabu {
// 	readonly name = "zabu"
// 	strength = 12
// 	public dexterity = 14
// 	private constitution = 7
//
// 	yell() {
// 		return this.name
// 	}
// }
//
// type Sub = {
// 	x: number
// 	y: string
// 	z: {
// 		t: number
// 	}
// }
//
// type Alias = Zabu

// class Zabu {
// 	x = 12
// }

type MutableX = {
	x: Number
}

type UnknownX<T = unknown> = {
	x: T
}

type Id<T = null> = number

type MutableY = {
	y?: Number
}

type MutableXY = Pick<MutableX & MutableY, 'x' | 'y'>

const now = () => new Date()


class Zabu extends Coco<Date> {
	static staticValue = 23
	
	id: Id<"12">
	x = 12
	y?: UnknownX<number>
	z!: string

	yIsDefined() {
		return this.z != null
	}
}
//
// type ConstantX = Readonly<MutableX>

// export default Zabu
