import { Schema } from "../../Schema/Schema.js"
import { Typezer } from "../Typezer.js"

export function createSchema(this: Typezer): Schema {
	const schema: Schema = {}
	for (const declaration of this.declarations) {
		schema[declaration.id] = declaration
	}
	return schema
}
