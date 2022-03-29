export class BaseService {
	// constructor(public readonly context: string) {}
	/**
	 * Use this method to call another service from a service.
	 */
	// useService() {
	// 	return
	// }
}

export class zabu extends BaseService {
	x = 12
	add(x: number, y: number) {
		return x + y
	}
}

export class Coco {
	x = 12
}

export class Foo extends Coco {
	y = 121
}
