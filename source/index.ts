import { WatcherCallback } from "./types/WatcherCallback.js"
import { Typezer, TypezerOptions } from "./types/Typezer/Typezer.js"

export type { Type } from "./types/Type/Type.js"
export type { TypeName } from "./types/Type/TypeName.js"
export type { Types } from "./types/Type/Types.js"
export type { Schema } from "./types/Schema/Schema.js"
export type { Signature } from "./types/Signature/Signature.js"
export type { Declaration } from "./types/Declaration/Declaration.js"
export type { Modifier } from "./types/Modifier/Modifier.js"
export type { Property } from "./types/Properties/Property.js"
export type { Properties } from "./types/Properties/Properties.js"

export { Typezer, TypezerOptions }

export const findManyDeclarations = (options: TypezerOptions) => {
	return new Typezer(options).schema
}

/**
 * @param {string} symbol name of the declaration
 */
export const findDeclaration = (
	symbol: string,
	options: Omit<TypezerOptions, "symbols">
) => {
	const { schema } = new Typezer({
		...options,
		symbols: [symbol],
	})
	const declaration = schema[symbol]
	return { declaration, schema }
}

export const watchDeclarations = (
	options: TypezerOptions & { onChange: WatcherCallback }
) => new Typezer(options).watch(options.onChange)
