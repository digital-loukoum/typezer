import type { Type } from "../Type/Type"
import type { Path } from "../Path/Path"
import inspect from "object-inspect"
import { validators } from "./validators"
import { getSchemaReference } from "../Schema/getSchemaReference"
import { Schema } from "../Schema/Schema"
import { Types } from "../Type/Types"
import { Signature } from "../Signature/Signature"
import { Callable } from "../Signature/Callable"

export type ValidateSignatureResult = {
	errors?: Array<string>
	returnType?: Type
}

export class Validator {
	errors: Array<string> = []
	path: Array<string> = []
	validated = new WeakMap<Type, Set<unknown>>()
	validators = validators.call(this)

	constructor(public schema: Schema) {}

	findTypeByPath = (path: Path): Type => getSchemaReference(this.schema, path)

	validatePath = (path: Path, value: unknown) => {
		const type = this.findTypeByPath(path)
		return this.validate(type, value)
	}

	validate = (type: Type, value: unknown) => {
		let validatedValues = this.validated.get(type)
		if (!validatedValues) this.validated.set(type, (validatedValues = new Set()))

		if (!validatedValues.has(value)) {
			validatedValues.add(value)
			this.validators[type.typeName]?.(type as any, value)
		}

		return this
	}

	validateSignaturePath = (
		path: Path,
		parameters: unknown[]
	): ValidateSignatureResult => {
		const type = this.findTypeByPath(path)
		if (type.typeName != "Function" && type.typeName != "Constructor") {
			this.mismatch("a function or a constructor", type.typeName)
			return { errors: this.errors }
		}
		return this.validateSignature(type, parameters)
	}

	validateSignature = <Type extends Callable>(
		callable: Type,
		parameters: unknown[]
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
