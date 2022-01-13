import ts from "typescript"
import { SourceFile } from "./SourceFile"

export function createSourceFile(sourceFile: ts.SourceFile): SourceFile {
	return new SourceFile(sourceFile)
}
