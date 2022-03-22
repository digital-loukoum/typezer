import ts from "typescript"
import { WatcherCallback } from "./types/WatcherCallback"
import { Typezer } from "./types/Typezer/Typezer"

export { Typezer } from "./types/Typezer/Typezer"

export const getAllDeclarations = (files: string[], options: ts.CompilerOptions = {}) => {
	return new Typezer(files, options).declarations
}

export const getSchema = (files: string[], options: ts.CompilerOptions = {}) => {
	return new Typezer(files, options).schema
}

export const findDeclarationByName = (
	files: string[],
	declarationName: string,
	options: ts.CompilerOptions
) => {
	const { schema, declarations } = new Typezer(files, options)
	const declaration = schema[declarationName]
	return { declaration, schema, declarations }
}

export const watch = (
	files: string[],
	onChange: WatcherCallback,
	options: ts.CompilerOptions = {}
) => new Typezer(files, options).watch(onChange)
