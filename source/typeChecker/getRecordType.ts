import ts from "typescript"

export function getRecordType(type: ts.Type): [key: ts.Type, value: ts.Type] | undefined {
	if ((type as ts.ObjectType).objectFlags & ts.ObjectFlags.Mapped) {
		const typeArguments: undefined | ts.Type[] = (type as any).mapper?.mapper2?.targets
		if (typeArguments) {
			const [key, value] = typeArguments
			return [key, value]
		}
	}
}
