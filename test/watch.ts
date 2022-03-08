import { watch } from "../source"

watch(["test/samples/watched.ts"], ({ declarations, definitions }) => {
	console.log("[ DEFINITIONS ]")
	console.dir(definitions, { depth: null })

	console.log("\n[ DECLARATIONS ]")
	console.dir(declarations, { depth: null })
})
