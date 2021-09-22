import { Organism } from "./Organism"

export class Molecule {
	isArray(): this is ArrayMolecule {
		return this instanceof ArrayMolecule
	}
	isTuple(): this is TupleMolecule {
		return this instanceof TupleMolecule
	}
	isRecord(): this is RecordMolecule {
		return this instanceof RecordMolecule
	}
	isObject(): this is ObjectMolecule {
		return this instanceof ObjectMolecule
	}
	isMap(): this is MapMolecule {
		return this instanceof MapMolecule
	}
	isSet(): this is SetMolecule {
		return this instanceof SetMolecule
	}
	isUnion(): this is UnionMolecule {
		return this instanceof UnionMolecule
	}
	isNullable(): this is NullableMolecule {
		return this instanceof NullableMolecule
	}
}

export class RecordMolecule extends Molecule {
	constructor(public of: Organism) {
		super()
	}
}

export class ArrayMolecule extends Molecule {
	constructor(public of: Organism) {
		super()
	}
}

export class TupleMolecule extends Molecule {
	constructor(public of: Organism[]) {
		super()
	}
}

export class ObjectMolecule extends Molecule {
	constructor(public properties: Record<string, Organism>) {
		super()
	}
}

export class MapMolecule extends Molecule {
	constructor(public key: Organism, public value: Organism) {
		super()
	}
}

export class SetMolecule extends Molecule {
	constructor(public of: Organism) {
		super()
	}
}

export class UnionMolecule extends Molecule {
	constructor(public types: Organism[]) {
		super()
	}
}

export class NullableMolecule extends Molecule {
	constructor(public of: Organism) {
		super()
	}
}
