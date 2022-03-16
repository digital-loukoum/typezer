var x: { [Key: number]: string }

// export type GenericType<T extends String> = {
// 	x: T
// }

// export function myGenericFunction<GenericType>(
// 	a1: GenericType,
// 	a2: GenericType
// ): GenericType {
// 	return a1
// }

// export const genericFunctionClone = myGenericFunction

// export type Records = {
// 	String_Number: Record<string, number>
// 	String_String: Record<string, string>
// 	Union_String: Record<"12" | "15", string>
// }

// export type PromiseConstructorLike = new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) => PromiseLike<T>;

// interface PromiseLike<T> {
// 	then<TResult1 = T, TResult2 = never>(
// 		onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
// 		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
// 	): PromiseLike<TResult1 | TResult2>
// }

// interface PromiseLikeSimple {
// 	then(
// 		onfulfilled?: ((value: any) => PromiseLikeSimple) | undefined | null,
// 		onrejected?: ((reason: any) => PromiseLikeSimple) | undefined | null
// 	): PromiseLikeSimple
// }
