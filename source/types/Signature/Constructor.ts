import { Signature } from "./Signature"

export type Constructor = Omit<Signature, "returnType">
