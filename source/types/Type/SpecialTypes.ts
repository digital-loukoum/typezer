import { ValidationErrors } from "../ValidationError/ValidationError"
import { BaseType } from "./BaseType"

export class ResolvingType extends BaseType {
	static readonly type = "Resolving..."

	constructor(id: number) {
		super()
		this.id = id
	}
}

export class ReferenceType extends BaseType {
	static readonly type = "Reference"

	constructor(public reference: number) {
		super()
	}
}
