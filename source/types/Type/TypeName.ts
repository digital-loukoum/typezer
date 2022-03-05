import * as Types from "./Types"

export type TypeName = typeof Types[keyof typeof Types]["type"]
