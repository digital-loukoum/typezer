import ts from "typescript"
import { WatcherCallback } from "./types/WatcherCallback"
import { Typezer } from "./types/Typezer/Typezer"

export { Typezer } from "./types/Typezer/Typezer"

export const getAllDeclarations = (files: string[], options: ts.CompilerOptions = {}) => {
	return new Typezer(files, options).declarations
}

export const findDeclarationByName = (
	files: string[],
	declarationName: string,
	options: ts.CompilerOptions = {}
) => {
	const declarations = getAllDeclarations(files, options)
	return declarations.find(declaration => declaration.name == declarationName)
}

export const watch = (
	files: string[],
	onChange: WatcherCallback,
	options: ts.CompilerOptions = {}
) => new Typezer(files, options).watch(onChange)
