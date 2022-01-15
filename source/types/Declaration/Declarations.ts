import ts from "typescript"
import { getTypeChecker } from "../../utilities/typeChecker"
import { createType } from "../Type/createType"
import { BaseDeclaration } from "./BaseDeclaration"

export class EnumerationDeclaration extends BaseDeclaration {
	readonly declare = "enumeration"

	static fromTsNode(tsNode: ts.Node) {
		if (ts.isEnumDeclaration(tsNode)) {
			const tsType = getTypeChecker().getTypeAtLocation(tsNode)
			return new EnumerationDeclaration(createType(tsType, tsNode))
		}
	}
}

export class ClassDeclaration extends BaseDeclaration {
	readonly declare = "class"

	static fromTsNode(tsNode: ts.Node) {
		if (ts.isClassDeclaration(tsNode)) {
			const tsType = getTypeChecker().getTypeAtLocation(tsNode)
			return new ClassDeclaration(createType(tsType, tsNode))
		}
	}
}

export class InterfaceDeclaration extends BaseDeclaration {
	readonly declare = "interface"

	static fromTsNode(tsNode: ts.Node) {
		if (ts.isInterfaceDeclaration(tsNode)) {
			const tsType = getTypeChecker().getTypeAtLocation(tsNode)
			return new InterfaceDeclaration(createType(tsType, tsNode))
		}
	}
}

export class TypeDeclaration extends BaseDeclaration {
	readonly declare = "type"

	static fromTsNode(tsNode: ts.Node) {
		if (ts.isTypeAliasDeclaration(tsNode)) {
			const tsType = getTypeChecker().getTypeAtLocation(tsNode)
			return new InterfaceDeclaration(createType(tsType, tsNode))
		}
	}
}
