import { Typezer } from "../../source"
import start from "fartest"

start("Declarations", async ({ stage, same }) => {
	const typezer = new Typezer(["test/samples/declarations.ts"])
	const declarations = Object.fromEntries(
		typezer.getAllDeclarations().map(declaration => [declaration.name, declaration])
	)
	const checkDeclaration = (name: string, declare: string) => {
		stage(name)
		same(declarations[name].declare, declare, "Check declaration file and declared type")
	}

	checkDeclaration("Class", "class")
	checkDeclaration("TypeAlias", "type")
	checkDeclaration("Type", "type")
	checkDeclaration("Interface", "interface")
	checkDeclaration("ConstantVariable", "variable")
	checkDeclaration("AnotherConstantVariable", "variable")
	checkDeclaration("Variable", "variable")
	checkDeclaration("Function", "function")
	checkDeclaration("AliasConstantVariable", "export")
	checkDeclaration("AliasVariable", "export")
	checkDeclaration("default", "default")
})
