import type ts from "typescript"
import { createModifier } from "./createModifier.js";
import { Modifier } from "./Modifier.js";

export function addModifier(modifiers: Array<Modifier>, tsModifier: ts.Modifier) {
	const modifier = createModifier(tsModifier)
	if (modifier) modifiers.push(modifier)
}