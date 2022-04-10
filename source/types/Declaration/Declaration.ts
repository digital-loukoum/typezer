import { Type } from "../Type/Type.js"
import { RawDeclaration } from "./RawDeclaration.js"

export type Declaration = Type &
	Omit<Required<RawDeclaration>, "rawType" | "node" | "type">
