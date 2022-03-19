import { Type } from "../Type/Type"

export type Signature = {
	minimumParameters: number
	parameters: Type[]
	restParameters?: Type
	returnType: Type
}
