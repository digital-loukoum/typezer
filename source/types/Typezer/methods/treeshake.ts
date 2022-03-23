import { Schema } from "../../Schema/Schema"
import { Type } from "../../Type/Type"
import { walk } from "../../Type/walk"
import { Typezer } from "../Typezer"

export function treeshake(this: Typezer): Schema {
	const result: Schema = {}
	const rootFiles = this.entrySourceFiles.map(({ fileName }) => fileName)

	const findAndAddReferencesToSchema = (type: Type) => {
		walk(
			this.fullSchema,
			type => {
				if (type.typeName != "Reference") return
				const [targetItem] = type.path
				if (targetItem?.kind != "declaration") return
				if (!result[targetItem.id]) {
					result[targetItem.id] = this.fullSchema[targetItem.id]
					findAndAddReferencesToSchema(result[targetItem.id])
				}
			},
			type
		)
	}

	this.declarations.forEach(declaration => {
		if (!rootFiles.includes(declaration.fileName)) return
		if (!this.matchRootSymbol(declaration.name)) return
		result[declaration.id] = declaration
		findAndAddReferencesToSchema(declaration)
	})

	return result
}
