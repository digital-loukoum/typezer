import { SyntaxKind } from "./typescript"
import type { Node } from "./typescript"

export type Visitor = Record<keyof typeof SyntaxKind, (node: Node) => unknown>
