type OneGeneric_1<T> = {
	T: T
}

type ThreeGenerics_3<A, B, C> = {
	A: A
	B: B
	C: C
}

type Constraint_1<S extends string> = {
	String: S
}

function Function_1<A>(A: A): A {
	return A
}

type Circular_1<C1> = {
	self<C2 = C1>(): Circular_1<C2>
}
