import ts from "typescript"
import { WatcherCallback } from "./types/WatcherCallback"
import { Typezer } from "./Typezer"

export { Typezer } from "./Typezer"

export const getAllDeclarations = (files: string[], options: ts.CompilerOptions = {}) => {
	const typezer = new Typezer(files, options)
	return {
		definitions: typezer.definitions,
		declarations: typezer.declarations,
	}
}

export const findDeclaration = (
	files: string[],
	declarationName: string,
	options: ts.CompilerOptions = {}
) => {
	const { definitions, declarations } = getAllDeclarations(files, options)
	return {
		definitions,
		declaration: declarations.find(declaration => declaration.name == declarationName),
	}
}

export const watch = (
	files: string[],
	onChange: WatcherCallback,
	options: ts.CompilerOptions = {}
) => new Typezer(files, options).watch(onChange)
