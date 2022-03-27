import ts from "typescript"
import { Type } from "../Type/Type"
import { Scope } from "./Scope"

export function getScopeReference(scope: Scope, rawType: ts.Type): Type | undefined {
	for (let index = scope.length - 1; index >= 0; index--) {
		const item = scope[index]
		if (item.rawType == rawType) {
			return {
				typeName: "CircularReference",
				level: scope.length - index,
			}
		}
	}
}
