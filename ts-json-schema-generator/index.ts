import tsj from "ts-json-schema-generator"
import fs from "fs"

const config = {
	path: "test/samples/checkExportedTypes.ts",
	tsconfig: "tsconfig.json",
	type: "*", // Or <type-name> if you want to generate schema for that one type only
}

const schema = tsj.createGenerator(config).createSchema(config.type)
const schemaString = JSON.stringify(schema, null, 2)

console.log(schemaString)
