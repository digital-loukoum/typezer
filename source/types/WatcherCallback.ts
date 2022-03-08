import { Declaration } from "./Declaration/Declaration"
import { Definitions } from "./Definition/definitions"

export type WatcherCallback = (payload: {
	declarations: Declaration[]
	definitions: Definitions
}) => any
