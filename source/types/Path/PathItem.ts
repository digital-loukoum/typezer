export type PathItem =
	| {
			kind: "declaration"
			id: string
	  }
	| {
			kind: "generic"
			name: string
	  }
	| {
			kind: "property"
			name: string
	  }
	| {
			kind: "tupleItem"
			index: number
	  }
	| {
			kind: "keys"
	  }
	| {
			kind: "items"
	  }
