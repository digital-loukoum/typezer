import type { Type } from "../Type/Type"
import inspect from "object-inspect"
import { validators } from "./validators"
import { Schema } from "../Schema/Schema"
import { Callable } from "../Signature/Callable"

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

	constructor(public schema: Schema) {}

	validate = (type: Type, value: unknown, scope: Type[] = []) => {
		scope.push(type)
		let validatedValues = this.validated.get(type)
		if (!validatedValues) this.validated.set(type, (validatedValues = new Set()))

		if (!validatedValues.has(value)) {
			validatedValues.add(value)
			this.validators[type.typeName]?.(type as any, value)
		}

		scope.pop()
		return this
	}

	validateSignature = <CallableType extends Callable>(
		callable: CallableType,
		parameters: unknown[],
		scope: Type[] = []
	): ValidateSignatureResult => {
		const errors: Array<string> = []
		const localValidator = this.fork()

		for (const signature of callable.signatures) {
			if (parameters.length < signature.minimumParameters) {
				localValidator.mismatch(
					`minimum ${signature.minimumParameters} minimum parameters`,
					`${parameters.length} parameters`
				)
			} else if (
				!signature.restParameters &&
				parameters.length > signature.parameters.length
			) {
				localValidator.mismatch(
					`maximum ${signature.parameters.length} parameters`,
					`${parameters.length} parameters`
				)
			} else {
				signature.parameters.forEach((parameterType, index) => {
					localValidator.validate(parameterType, parameters[index], scope)
				})
				if (signature.restParameters) {
					for (
						let index = signature.parameters.length;
						index < parameters.length;
						index++
					) {
						localValidator.validate(signature.restParameters, parameters[index], scope)
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
		const pathInfos = path ? `at '${this.joinPath()}'` : ""
		this.errors.push(
			`Expected ${inspect(expected)} but received ${inspect(value)} ${pathInfos}`
		)
	}

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
