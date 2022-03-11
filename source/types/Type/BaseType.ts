import ts from "typescript"
import { enumerable } from "../../utilities/enumerable"
import { getPlainObject } from "../../utilities/getPlainObject"
import { Definitions } from "../Definition/definitions"
import { createModifier } from "../Modifier/createModifier"
import { Modifier } from "../Modifier/Modifier"
import { Type } from "./Type"

export abstract class BaseType {
	public id?: number
	public definitions?: Definitions // definitions added by generics

	// When multiple types match, priority is used to determine which one should prevail
	static readonly priority: number = 0
	static readonly typeName: string
	static readonly isPrimitive?: boolean

	/**
	 * Create a new Type from a Typescript type
	 */
	static fromTsType(tsType: ts.Type, tsNode: ts.Node): BaseType | undefined {
		throw new Error(`This function should be implemented by a child class`)
	}

	/**
	 * Modifiers
	 */
	public optional?: boolean
	public modifiers?: Modifier[]
	public decorators?: string[]

	@enumerable(true)
	get typeName(): string {
		return (this.constructor as unknown as BaseType).typeName
	}

	addModifier(tsModifier?: ts.Modifier): void {
		if (!tsModifier) return
		this.modifiers ??= []
		this.modifiers.push(createModifier(tsModifier))
	}

	toString(): string {
		return this.typeName
	}

	toJson(): string {
		return JSON.stringify(this.toPlainObject(), null, "  ")
	}

	toPlainObject(): Type {
		return getPlainObject(this) as Type
	}
}
