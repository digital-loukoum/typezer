import { SyntaxKind } from "./typescript"
import type { Node } from "./typescript"

export type Visitor = Partial<Record<keyof typeof SyntaxKind, (node: any) => unknown>>
