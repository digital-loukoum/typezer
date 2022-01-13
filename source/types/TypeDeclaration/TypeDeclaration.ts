import * as TypeDeclarations from "./TypeDeclarations"

export type TypeDeclaration =
	typeof TypeDeclarations[keyof typeof TypeDeclarations]["prototype"]
