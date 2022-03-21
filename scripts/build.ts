import { compile, patch } from "@digitak/tsc-esm"
import * as fs from "fs"

console.log("Cleaning library...")
fs.rmSync("library", { force: true, recursive: true })

console.log("Compiling typescript...")
compile()

console.log("Patching imports...")
patch()

console.log("✨ Build done\n")
