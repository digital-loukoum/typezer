import ts from "typescript"
import { someBaseType } from "../typeChecker"

export function getPrimitiveType(type: ts.Type): ts.Type | false {
	return someBaseType(type, type => (!(type.flags & ts.TypeFlags.Object) ? type : false))
}
