import { getAllDeclarations, getSchema } from "../../source"
import start from "fartest"

start("Declarations", async ({ stage, test, same }) => {
	const schema = getSchema(["test/samples/declarations.ts"])

	// console.dir(schema)

	const checkDeclaration = (name: string, declare: string) => {
		stage(name)
		same(schema[name].declare, declare, "Check declaration declared type")
	}

	checkDeclaration("Class", "class")
	checkDeclaration("TypeAlias", "type")
	checkDeclaration("Type", "type")
	checkDeclaration("Interface", "interface")
	checkDeclaration("ConstantVariable", "variable")
	checkDeclaration("AnotherConstantVariable", "variable")
	checkDeclaration("Variable", "variable")
	checkDeclaration("Function", "function")
	checkDeclaration("declarations", "default")

	stage("ExportAliases")
	test(schema.ConstantVariable.exportedAs.includes("AliasConstantVariable"))
	test(schema.Variable.exportedAs.includes("AliasVariable"))
})
