import * as Declarations from "./Declarations"

export type Declaration = typeof Declarations[keyof typeof Declarations]["prototype"]
