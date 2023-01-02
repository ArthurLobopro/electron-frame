const { execSync } = require("child_process")
const fs = require("fs")
const { resolve } = require("path")
const { clonePackage } = require("./util/clonePackage.js")

const root_dir = resolve(__dirname, '../')
const npm_dir = resolve(root_dir, "npm")

//Make npm directory
console.log("Making npm directory...")

if (!fs.existsSync(npm_dir)) {
    fs.mkdirSync(npm_dir)
} else {
    fs.rmSync(npm_dir, { recursive: true })
    fs.mkdirSync(npm_dir)
}

//Transpile typescript
console.log("Transpiling typescript...")
execSync("yarn tsc")

//Transpile Sass
console.log("Transpiling scss...")
execSync("yarn sass-compiler --compile")

//Clone package.json
console.log("Generating package.json...")
fs.writeFileSync(resolve(npm_dir, "package.json"), clonePackage())

//Copy README.md
console.log("Copying README.md...")
fs.copyFileSync(resolve(root_dir, "README.md"), resolve(npm_dir, "README.md"))

//Copy renderer div content
console.log("Copying files...")
const { copyDirContent } = require('copy-directory')

copyDirContent(
    resolve(root_dir, "src/renderer"),
    resolve(npm_dir, "renderer"),
    [
        ".ts",
        ".scss"
    ]
)