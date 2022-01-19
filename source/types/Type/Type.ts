import * as Types from "./Types"

export type Type = typeof Types[keyof typeof Types]["prototype"]
