import { stringify } from "@digitak/cute"

export function inspect(value: any, colors = false): string {
	return stringify(value, { colors })
}
