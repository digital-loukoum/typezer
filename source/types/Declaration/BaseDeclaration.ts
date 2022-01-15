import ts from "typescript"
import { Type } from "../Type/Type"

export abstract class BaseDeclaration {
	abstract readonly declare: string

	constructor(public value: Type) {}

	/**
	 * Create a new declaration from a Typescript type
	 */
	static fromTsNode(tsNode: ts.Node): BaseDeclaration | undefined {
		throw new Error(`This function should be implemented by a child class`)
	}
}
