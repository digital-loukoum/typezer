import ts from "typescript"
import { Modifier } from "./Modifier"

export function createModifier(tsModifier: ts.Modifier): Modifier {
	const { kind } = tsModifier
	if (kind == ts.SyntaxKind.AbstractKeyword) return "abstract"
	if (kind == ts.SyntaxKind.AsyncKeyword) return "async"
	if (kind == ts.SyntaxKind.ConstKeyword) return "const"
	if (kind == ts.SyntaxKind.DefaultKeyword) return "default"
	if (kind == ts.SyntaxKind.ExportKeyword) return "export"
	if (kind == ts.SyntaxKind.PrivateKeyword) return "private"
	if (kind == ts.SyntaxKind.ProtectedKeyword) return "protected"
	if (kind == ts.SyntaxKind.PublicKeyword) return "public"
	if (kind == ts.SyntaxKind.OverrideKeyword) return "override"
	if (kind == ts.SyntaxKind.ReadonlyKeyword) return "readonly"
	if (kind == ts.SyntaxKind.StaticKeyword) return "static"
	throw new Error(`Unknown property tsModifier: ${tsModifier}`)
}
