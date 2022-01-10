import type { PropertyModifier } from "./PropertyModifier"
import ts from "typescript"
import { Type } from "../Type"

export abstract class BaseProperty {
	static fromType: (type: Type) => BaseProperty | undefined
	static readonly priority: number = 0 // higher the number, lower the priority

	abstract readonly type: string

	public optional?: boolean
	public modifiers?: PropertyModifier[]
	public decorators?: string[]

	getStaticProperty<Key extends keyof BaseProperty>(key: Key): BaseProperty[Key] {
		// @ts-ignore
		return this.constructor[key]
	}

	addModifier(modifier?: ts.Modifier) {
		if (!modifier) return
		if (!this.modifiers) this.modifiers = []

		switch (modifier.kind) {
			case ts.SyntaxKind.AbstractKeyword:
				this.modifiers.push("abstract")
				break
			case ts.SyntaxKind.AsyncKeyword:
				this.modifiers.push("async")
				break
			case ts.SyntaxKind.ConstKeyword:
				this.modifiers.push("const")
				break
			case ts.SyntaxKind.DefaultKeyword:
				this.modifiers.push("default")
				break
			case ts.SyntaxKind.ExportKeyword:
				this.modifiers.push("export")
				break
			case ts.SyntaxKind.PrivateKeyword:
				this.modifiers.push("private")
				break
			case ts.SyntaxKind.ProtectedKeyword:
				this.modifiers.push("protected")
				break
			case ts.SyntaxKind.PublicKeyword:
				this.modifiers.push("public")
				break
			case ts.SyntaxKind.OverrideKeyword:
				this.modifiers.push("override")
				break
			case ts.SyntaxKind.ReadonlyKeyword:
				this.modifiers.push("readonly")
				break
			case ts.SyntaxKind.StaticKeyword:
				this.modifiers.push("static")
				break
		}
	}
}
