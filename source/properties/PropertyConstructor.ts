import type * as propertyConstructors from "./definitions"

export type PropertyConstructor =
	typeof propertyConstructors[keyof typeof propertyConstructors]
