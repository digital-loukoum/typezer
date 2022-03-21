import { Path } from "../Path/Path"
import { badPathItemKind, getPathTarget } from "../Type/getPathTarget"
import { Type } from "../Type/Type"
import { Schema } from "./Schema"

export function getSchemaReference(schema: Schema, path: Path): Type {
	if (path[0].kind != "declaration") throw badPathItemKind(path[0], "declaration")
	const { id } = path[0]
	const declaration = schema[id]
	if (!declaration) throw new Error(`Cannot find declaration '${id}' in schema`)
	return getPathTarget(declaration, path.slice(1))
}
