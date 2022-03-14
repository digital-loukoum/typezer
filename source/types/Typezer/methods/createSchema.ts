import { Schema } from "../../Schema"
import { Typezer } from "../Typezer"

export function createSchema(this: Typezer): Schema {
	const schema: Schema = {}
	for (const declaration of this.declarations) {
		schema[declaration.id] = declaration
	}
	return schema
}
