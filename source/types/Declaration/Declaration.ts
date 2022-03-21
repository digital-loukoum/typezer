import { Type } from "../Type/Type"
import { RawDeclaration } from "./RawDeclaration"

export type Declaration = Type &
	Omit<Required<RawDeclaration>, "rawType" | "node" | "type">
