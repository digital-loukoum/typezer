import prettyjson from "prettyjson"

export function inspect(value: any): string {
	const result = prettyjson.render(value, {
		keysColor: "white",
		numberColor: "blue",
		stringColor: "green",
	})
	if (typeof value !== "object") return result
	if (result.split("\n").length == 1) return `{ ${result} }`
	return `\n${result}\n`
}
