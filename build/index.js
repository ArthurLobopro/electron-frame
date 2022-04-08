const generatePackage = require('./package')
const fs = require('fs')
const path = require('path')
const { copy } = require('./copy')
const { copyDirSync } = require('copydirectory')

const baseDir = path.resolve(__dirname, '../')
const npmDir = path.resolve(baseDir, "npm")

const copyList = [
    {
        input: path.resolve(baseDir, "README.md"),
        out: path.resolve(npmDir, "README.md")
    },
    {
        input: path.resolve(baseDir, "src/renderer/style.css"),
        out: path.resolve(npmDir, "renderer/style.css")
    },
    {
        input: path.resolve(baseDir, "src/renderer/assets/"),
        out: path.resolve(npmDir, "renderer/assets/"),
        isDir: true
    }
]

if (!fs.existsSync(npmDir)) {
    fs.mkdirSync(npmDir)
}


copyList.forEach(({ input, out, isDir }) => isDir ? copyDirSync(input, out) : copy(input, out))
fs.writeFileSync(path.resolve(npmDir, "package.json"), generatePackage());