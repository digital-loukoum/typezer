import { Signature } from "./Signature.js"

export type Constructor = Omit<Signature, "returnType">
