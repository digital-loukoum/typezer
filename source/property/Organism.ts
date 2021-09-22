import { Atom } from "./Atom"
import { Molecule } from "./Molecule"

export type Organism = Atom | Molecule

export function isAtom(organism: Organism): organism is Atom {
	return typeof organism == "string"
}

export function isMolecule(organism: Organism): organism is Molecule {
	return !isAtom(organism)
}
