import { BaseType } from "./BaseType"

export class ResolvingType extends BaseType {
	readonly type = "Resolving..."

	constructor(id: number) {
		super()
		this.id = id
	}
}

export class ReferenceType extends BaseType {
	readonly type = "Reference"

	constructor(public reference: number) {
		super()
	}
}
