import { WatcherCallback } from "./types/WatcherCallback"
import { Typezer, TypezerOptions } from "./types/Typezer/Typezer"

export type { Type } from "./types/Type/Type"
export type { TypeName } from "./types/Type/TypeName"
export type { Types } from "./types/Type/Types"
export type { Schema } from "./types/Schema/Schema"
export type { Signature } from "./types/Signature/Signature"
export type { Declaration } from "./types/Declaration/Declaration"
export type { Modifier } from "./types/Modifier/Modifier"
export type { Property } from "./types/Properties/Property"
export type { Properties } from "./types/Properties/Properties"

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
