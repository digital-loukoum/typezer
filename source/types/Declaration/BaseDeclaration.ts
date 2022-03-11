import { Type } from "../Type/Type"
import { LocalDeclaration } from "./LocalDeclaration"

// export type BaseDeclaration = LocalDeclaration & {
// 	declare: string
// }

export abstract class BaseDeclaration extends LocalDeclaration {
	abstract readonly declare: string
	name = ""

	constructor(name = "", type: Type, public file = "", public used = false) {
		super(name, type)
	}
}
