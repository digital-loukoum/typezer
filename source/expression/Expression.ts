export abstract class Expression extends String {
	abstract type: string
	abstract expression: RegExp
}
