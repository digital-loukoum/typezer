import { RawDeclaration } from "./RawDeclaration"

export type Declaration = Omit<Required<RawDeclaration>, "rawType" | "node">
