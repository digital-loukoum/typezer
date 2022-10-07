import { Modifier } from "./Modifier.js"
import ts from "typescript"

export function createModifier(tsModifier: ts.ModifierLike): Modifier | undefined {
	const { kind } = tsModifier
	switch (kind) {
		case ts.SyntaxKind.AbstractKeyword: return "abstract"
		case ts.SyntaxKind.AsyncKeyword: return "async"
		case ts.SyntaxKind.ConstKeyword: return "const"
		case ts.SyntaxKind.DeclareKeyword: return "declare"
		case ts.SyntaxKind.DefaultKeyword: return "default"
		case ts.SyntaxKind.ExportKeyword: return "export"
		case ts.SyntaxKind.InKeyword: return "in"
		case ts.SyntaxKind.PrivateKeyword: return "private"
		case ts.SyntaxKind.ProtectedKeyword: return "protected"
		case ts.SyntaxKind.PublicKeyword: return "public"
		case ts.SyntaxKind.OutKeyword: return "out"
		case ts.SyntaxKind.OverrideKeyword: return "override"
		case ts.SyntaxKind.ReadonlyKeyword: return "readonly"
		case ts.SyntaxKind.StaticKeyword: return "static"
		case ts.SyntaxKind.StaticKeyword: return "static"
		case ts.SyntaxKind.Decorator: return undefined

		default:
			console.error(`[Typezer] Unknown property tsModifier: ${ts.SyntaxKind[kind]}`)
			return undefined
	}
}
