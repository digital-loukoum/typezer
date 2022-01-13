import ts from "typescript"
import { getTypeChecker } from "./typeChecker"

export function typeToString(type: ts.Type): string {
	return getTypeChecker().typeToString(
		type,
		undefined,
		ts.TypeFormatFlags.UseFullyQualifiedType
	)
}
