export type SomeLiterals = "12" | "15" | string | number
type SomeLiteralsAlias = SomeLiterals | "19"
export type RecordOfLiterals = Record<SomeLiteralsAlias, any>
