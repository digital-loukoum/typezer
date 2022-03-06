import ts from "typescript"
import { getTypeChecker } from "../../utilities/typeChecker"
import { createType } from "../Type/createType"
import { BaseDeclaration } from "./BaseDeclaration"

export class EnumerationDeclaration extends BaseDeclaration {
	readonly declare = "enumeration"

	static fromTsNode(tsNode: ts.Node, name: string) {
		if (ts.isEnumDeclaration(tsNode)) {
			const tsType = getTypeChecker().getTypeAtLocation(tsNode)
			return new EnumerationDeclaration(createType(tsType, tsNode, name))
		}
	}
}

export class ClassDeclaration extends BaseDeclaration {
	readonly declare = "class"

	static fromTsNode(tsNode: ts.Node, name: string) {
		if (ts.isClassDeclaration(tsNode)) {
			const tsType = getTypeChecker().getTypeAtLocation(tsNode)
			return new ClassDeclaration(createType(tsType, tsNode, name))
		}
	}
}

export class InterfaceDeclaration extends BaseDeclaration {
	readonly declare = "interface"

	static fromTsNode(tsNode: ts.Node, name: string) {
		if (ts.isInterfaceDeclaration(tsNode)) {
			const tsType = getTypeChecker().getTypeAtLocation(tsNode)
			return new InterfaceDeclaration(createType(tsType, tsNode, name))
		}
	}
}

export class TypeDeclaration extends BaseDeclaration {
	readonly declare = "type"

	static fromTsNode(tsNode: ts.Node, name: string) {
		if (ts.isTypeAliasDeclaration(tsNode)) {
			const tsType = getTypeChecker().getTypeAtLocation(tsNode)
			return new TypeDeclaration(createType(tsType, tsNode, name))
		}
	}
}

export class VariableDeclaration extends BaseDeclaration {
	readonly declare = "variable"

	static fromTsNode(tsNode: ts.Node) {
		if (ts.isVariableStatement(tsNode)) {
			const tsType = getTypeChecker().getTypeAtLocation(tsNode)
			return new VariableDeclaration(createType(tsType, tsNode))
		}
	}
}

export class FunctionDeclaration extends BaseDeclaration {
	readonly declare = "function"

	static fromTsNode(tsNode: ts.Node) {
		if (ts.isFunctionDeclaration(tsNode)) {
			const tsType = getTypeChecker().getTypeAtLocation(tsNode)
			return new FunctionDeclaration(createType(tsType, tsNode))
		}
	}
}

export class DefaultExportDeclaration extends BaseDeclaration {
	readonly declare = "default"

	static fromTsNode(tsNode: ts.Node, name: string) {
		if (ts.isExportAssignment(tsNode)) {
			const tsType = getTypeChecker().getTypeAtLocation(tsNode.getChildAt(0))
			return new DefaultExportDeclaration(createType(tsType, tsNode, name))
		}
	}
}
