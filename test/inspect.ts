import print from "@digitak/print"
import { getSchema } from "../source"

const schema = getSchema(["test/samples/inspected.ts"])

print`\n[underline:Schema]`
console.dir(schema, { depth: null })
