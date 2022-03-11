// export function myGenericFunction<GenericType>(
// 	a1: GenericType,
// 	a2: GenericType
// ): GenericType {
// 	return a1
// }

export type Records = {
	String_Number: Record<string, number>
	String_String: Record<string, string>
	Union_String: Record<"12" | "15", string>
}
