import { compile, patch } from "@digitak/tsc-esm"
import * as fs from "fs"

console.log("Cleaning package...")
fs.rmSync("package", { force: true, recursive: true })

console.log("Compiling typescript...")
compile()

console.log("Copying configuration files...")
fs.copyFileSync("./README.md", "./package/README.md")
fs.copyFileSync("./package.json", "./package/package.json")

console.log("Patching imports...")
patch()

console.log("✨ Build done\n")
