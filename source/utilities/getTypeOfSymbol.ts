import ts from "typescript"
import { getTypeChecker } from "./typeChecker"

export function getTypeOfSymbol(tsSymbol: ts.Symbol, tsNode: ts.Node): ts.Type {
	return getTypeChecker().getTypeOfSymbolAtLocation(tsSymbol, tsNode)
}
