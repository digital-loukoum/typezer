import typezer from "../source"
// import { readFileSync, readdirSync } from "fs"

typezer("test/samples/Zabu.ts")

// export function delint(sourceFile) {
// 	console.log("sourceFile", sourceFile)
// 	delintNode(sourceFile)
//
// 	function delintNode(node) {
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