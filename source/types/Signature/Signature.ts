import { Type } from "../Type/Type.js"

export type Signature = {
	minimumParameters: number
	parameters: Type[]
	restParameters?: Type
	returnType: Type
}
