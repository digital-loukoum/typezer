import ts from "typescript"

export const getTypeTarget = (rawType: ts.Type): ts.Type => (rawType as any).target
