import { WatcherCallback } from "./types/WatcherCallback"
import { Typezer, TypezerOptions } from "./types/Typezer/Typezer"

export { Typezer } from "./types/Typezer/Typezer"

export const getAllDeclarations = (options: TypezerOptions) => {
	return new Typezer(options).declarations
}

export const getSchema = (options: TypezerOptions) => {
	return new Typezer(options).schema
}

export const findSymbol = (symbol: string, options: Omit<TypezerOptions, "symbols">) => {
	const { schema, declarations } = new Typezer({
		...options,
		symbols: [symbol],
	})
	const declaration = schema[symbol]
	return { declaration, schema, declarations }
}

export const watch = (options: TypezerOptions & { onChange: WatcherCallback }) =>
	new Typezer(options).watch(options.onChange)
