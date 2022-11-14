const generatePackage = require('./package')
const fs = require('fs')
const path = require('path')
const { copy } = require('./copy')
const { copyDir, copyDirContent } = require('copy-directory')

const baseDir = path.resolve(__dirname, '../')
const npmDir = path.resolve(baseDir, "npm")

const tasks = [
    {
        type: "copy",
        args: [
            path.resolve(baseDir, "README.md"),
            path.resolve(npmDir, "README.md")
        ]
    },
    {
        type: "copyDirContent",
        args: [
            path.resolve(baseDir, "src/renderer"),
            path.resolve(npmDir, "renderer"),
            [
                ".ts",
                ".scss"
            ]
        ]
    },

]

const dirs_to_delete = [
    path.resolve(npmDir, "renderer", "assets"),
    path.resolve(npmDir, "renderer", "public"),
]

dirs_to_delete.forEach(dir => {
    if (fs.existsSync(dir)) {
        fs.rmdirSync(dir, { recursive: true })
    }
})

if (!fs.existsSync(npmDir)) {
    fs.mkdirSync(npmDir)
}

tasks.forEach(task => {
    if (task.type === "copy") {
        copy(...task.args)
    } else if (task.type === "copyDirContent") {
        copyDirContent(...task.args)
    }
})

fs.writeFileSync(path.resolve(npmDir, "package.json"), generatePackage())