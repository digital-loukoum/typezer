class Zabu {
	readonly name = "zabu"
	strength = 12
	public dexterity = 14
	private constitution = 7

	yell() {
		return this.name
	}
}

type Sub = {
	x: number
	y: string
	z: {
		t: number
	}
}

export default Zabu
