import ts from "typescript"
import { enumerable } from "../../utilities/enumerable"
import { createModifier } from "../Modifier/createModifier"
import { Modifier } from "../Modifier/Modifier"
import { ValidationErrors } from "../ValidationError/ValidationError"
import type { PlainTypeObject } from "./createTypeFromPlainObject"

export abstract class BaseType {
	public id!: number

	/**
	 * When multiple types match, priority is used to determine which one should prevail
	 */
	static readonly priority: number = 0

	/**
	 * The name of the type
	 */
	static readonly type: string

	/**
	 * Create a new Type from a Typescript type
	 */
	static fromTsType(tsType: ts.Type, tsNode: ts.Node): BaseType | undefined {
		throw new Error(`This function should be implemented by a child class`)
	}

	/**
	 * Create a new Type from a POJO type
	 */
	static fromPlainObject(object: PlainTypeObject): BaseType {
		const Type = this.constructor as any
		return Object.assign(new Type(), object)
	}

	validate(value: any, path: string[] = [], errors = new ValidationErrors()) {
		return errors
	}

	/**
	 * Modifiers
	 */
	public optional?: boolean
	public modifiers?: Modifier[]
	// public decorators?: string[]

	// @enumerable(true)
	get type(): string {
		return (this.constructor as unknown as BaseType).type
	}

	addModifier(tsModifier?: ts.Modifier): void {
		if (!tsModifier) return
		this.modifiers ??= []
		this.modifiers.push(createModifier(tsModifier))
	}

	toString(): string {
		return this.type
	}

	toJson(): string {
		return JSON.stringify(this.toPlainObject(), null, "  ")
	}

	toPlainObject(): PlainTypeObject {
		const object: PlainTypeObject & Record<string, any> = { id: this.id, type: this.type }
		for (const key in this) {
			if (key == "id") continue
			const value = this[key]
			if (Array.isArray(value)) {
				object[key] = value.map(item =>
					item instanceof BaseType ? item.toPlainObject() : item
				)
			} else if (value && typeof value == "object") {
				const entries = Object.entries(value)
				object[key] = Object.fromEntries(
					entries.map(([key, item]) => [
						key,
						item instanceof BaseType ? item.toPlainObject() : item,
					])
				)
			} else {
				object[key] = value instanceof BaseType ? value.toPlainObject() : value
			}
		}
		return object
	}
}
