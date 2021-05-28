import { readFileSync } from "fs"
import { createSourceFile, ScriptTarget, SyntaxKind } from "./typescript"
import TypeSniffer from "./sniffers/TypeSniffer"

function typezer(...files: string[]) {
	files.forEach(file => {
		console.log("Parse:", file)
		const sourceFile = createSourceFile(
			file,
			readFileSync(file).toString(),
			ScriptTarget.ES2020,
			/*setParentNodes */ true
		)

		try {
			const result = new TypeSniffer(sourceFile).sniff()
			console.log(result)
			return result
		} catch (error) {
			return null
		}
	})
}

export default typezer

//
// export function delint(sourceFile: ts.SourceFile) {
// 	console.log("sourceFile", sourceFile)
// 	delintNode(sourceFile)
//
// 	function delintNode(node: Node) {
// 		switch (node.kind) {
// 			case SyntaxKind.ForStatement:
// 			case SyntaxKind.ForInStatement:
// 			case SyntaxKind.WhileStatement:
// 			case SyntaxKind.DoStatement:
// 				if (node.statement.kind !== SyntaxKind.Block) {
// 					report(
// 						node,
// 						"A looping statement's contents should be wrapped in a block body."
// 					)
// 				}
// 				break
//
// 			case SyntaxKind.IfStatement:
// 				const ifStatement = node
// 				if (ifStatement.thenStatement.kind !== SyntaxKind.Block) {
// 					report(
// 						ifStatement.thenStatement,
// 						"An if statement's contents should be wrapped in a block body."
// 					)
// 				}
// 				if (
// 					ifStatement.elseStatement &&
// 					ifStatement.elseStatement.kind !== SyntaxKind.Block &&
// 					ifStatement.elseStatement.kind !== SyntaxKind.IfStatement
// 				) {
// 					report(
// 						ifStatement.elseStatement,
// 						"An else statement's contents should be wrapped in a block body."
// 					)
// 				}
// 				break
//
// 			case SyntaxKind.BinaryExpression:
// 				const op = node.operatorToken.kind
// 				if (
// 					op === SyntaxKind.EqualsEqualsToken ||
// 					op === SyntaxKind.ExclamationEqualsToken
// 				) {
// 					report(node, "Use '===' and '!=='.")
// 				}
// 				break
// 		}
//
// 		ts.forEachChild(node, delintNode)
// 	}
//
// 	function report(node, message) {
// 		const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart())
// 		console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`)
// 	}
// }
//
// const fileNames = readdirSync("test/entities")
// fileNames.forEach(fileName => {
// 	// Parse a file
// 	fileName = "test/entities/" + fileName
// 	console.log("Parse:", fileName)
// 	const sourceFile = ts.createSourceFile(
// 		fileName,
// 		readFileSync(fileName).toString(),
// 		ts.ScriptTarget.ES2015,
// 		/*setParentNodes */ true
// 	)
//
// 	// delint it
// 	delint(sourceFile)
// })
