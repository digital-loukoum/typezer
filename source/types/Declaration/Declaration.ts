import { Type } from "../Type/Type"
import { RawDeclaration } from "./RawDeclaration"

export type Declaration = Omit<RawDeclaration, "type"> & {
	type: Type
}
