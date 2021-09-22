import typescript from "typescript"
import type { Node, SyntaxKind } from "typescript"

export type Visitor = Partial<Record<keyof typeof SyntaxKind, (node: any) => unknown>>
