import type { Type } from "../Type/Type.js"
import { validators } from "./validators.js"
import { Types } from "../Type/Types.js"
import { inspect } from "../../utilities/inspect.js"

export type ValidateSignatureResult = {
	errors?: Array<string>
	returnType?: Type
}

export class Validator {
	errors: Array<string> = []
	path: Array<string> = []
	scope: Array<Type> = []
	validated = new WeakMap<Type, Set<unknown>>()
	validators = validators.call(this)

	protected resolvedGenericsCache = new Map<number, Type | undefined>()

	constructor(public schema: Record<string, Type>) {}

	validate = (type: Type, value: unknown) => {
		this.scope.push(type)
		let validatedValues = this.validated.get(type)
		if (!validatedValues) this.validated.set(type, (validatedValues = new Set()))

		if (!validatedValues.has(value)) {
			validatedValues.add(value)
			this.validators[type.typeName]?.(type as any, value)
		}

		this.scope.pop()
		return this
	}

	validateSignature = (
		type: Types["Function"],
		parameters: unknown[]
	): ValidateSignatureResult => {
		const errors: Array<string> = []
		const localValidator = this.fork()

		for (const signature of type.signatures) {
			if (parameters.length < signature.minimumParameters) {
				localValidator.mismatch(
					`${parameters.length} parameters`,
					`minimum ${signature.minimumParameters} parameters`
				)
			} else if (
				!signature.restParameters &&
				parameters.length > signature.parameters.length
			) {
				localValidator.mismatch(
					`${parameters.length} parameters`,
					`maximum ${signature.parameters.length} parameters`
				)
			} else {
				signature.parameters.forEach((parameterType, index) => {
					localValidator.validate(parameterType, parameters[index])
				})
				if (signature.restParameters) {
					for (
						let index = signature.parameters.length;
						index < parameters.length;
						index++
					) {
						localValidator.validate(signature.restParameters, parameters[index])
					}
				}
			}

			// if the localValidator has no errors, then the signature passed
			if (!localValidator.errors.length) {
				return { returnType: signature.returnType }
			} else {
				errors.push(...localValidator.errors)
				localValidator.errors = []
			}
		}

		this.errors.push(...errors)
		return { errors }
	}

	mismatch = (value: any, expected: any) => {
		const path = this.joinPath()
		const pathInfos = path ? ` at '${this.joinPath()}'` : ""
		this.errors.push(`Expected ${expected} but received ${value}${pathInfos}`)
	}

	mismatchValue = (value: any, expected: any) => this.mismatch(inspect(value), expected)

	mismatchExact = (value: any, expected: any) =>
		this.mismatchValue(value, inspect(expected))

	missing = (key: string) => {
		const path = this.joinPath()
		const pathInfos = path ? `in '${this.joinPath()}'` : ""
		this.errors.push(`Key '${key}' missing ${pathInfos}`)
	}

	findParentReference(level: number): Type {
		if (level >= this.scope.length) throw new Error(`No parent at level ${level}`)
		return this.scope[this.scope.length - level]
	}

	/**
	 * Create a new validator that shares the validated values
	 */
	fork = () => {
		const forked = new Validator(this.schema)
		forked.validated = this.validated
		return forked
	}

	joinPath = () => {
		return this.path.join(".")
	}
}
