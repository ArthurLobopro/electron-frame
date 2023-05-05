const { execSync } = require("child_process")
const fs = require("fs")
const { resolve } = require("path")

const root_dir = resolve(__dirname, '../')
const dist_dir = resolve(root_dir, "./dist")

//Make npm directory
console.log("Making dist directory...")

if (!fs.existsSync(dist_dir)) {
    fs.mkdirSync(dist_dir)
} else {
    fs.rmSync(dist_dir, { recursive: true })
    fs.mkdirSync(dist_dir)
}

//Transpile typescript
console.log("Transpiling typescript...")
execSync("yarn tsc")

//Transpile Sass
console.log("Transpiling scss...")
execSync("yarn sass-compiler --compile")

//Copy renderer div content
console.log("Copying files...")
const { copyDirContent } = require('copy-directory')

copyDirContent(
    resolve(root_dir, "src/renderer"),
    resolve(dist_dir, "renderer"),
    [
        ".ts",
        ".scss"
    ]
)