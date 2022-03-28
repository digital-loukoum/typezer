import { WatcherCallback } from "./types/WatcherCallback"
import { Typezer, TypezerOptions } from "./types/Typezer/Typezer"

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
