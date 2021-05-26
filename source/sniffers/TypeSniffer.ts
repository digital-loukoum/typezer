import type { Visitor } from "../Visitor"
import type { Node } from "../typescript"

export default class TypeSniffer {
	constructor(private root: Node) {}

	sniff() {}

	private visitor: Visitor = {}
}
