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
			kind: "staticProperty"
			name: string
	  }
	| {
			kind: "parameter"
			name: string
	  }
	| {
			kind: "tupleItem"
			index: number
	  }
	| {
			kind: "unionItem"
			index: number
	  }
	| {
			kind: "keys"
	  }
	| {
			kind: "items"
	  }
	| {
			kind: "item"
	  }
