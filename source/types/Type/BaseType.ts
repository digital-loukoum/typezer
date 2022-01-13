import ts from "typescript"
import { createModifier } from "../Modifier/createModifier"
import { Modifier } from "../Modifier/Modifier"

export abstract class BaseType {
	public id!: number

	/**
	 * When multiple types match, priority is used to determine which one should prevail
	 */
	static readonly priority: number = 0

	/**
	 * Create a new Type from a Typescript type
	 */
	static fromTsType(tsType: ts.Type, tsNode: ts.Node): BaseType | void {
		throw new Error(`This function should be implemented by a child class`)
	}

	/**
	 * The name of the type
	 */
	abstract readonly type: string

	public optional?: boolean
	public modifiers?: Modifier[]
	public decorators?: string[]

	addModifier(tsModifier?: ts.Modifier): void {
		if (!tsModifier) return
		this.modifiers ??= []
		this.modifiers.push(createModifier(tsModifier))
	}
}
