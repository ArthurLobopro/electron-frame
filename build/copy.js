const fs = require('fs')
const path = require('path')

function copy(filePath, outPath) {
    if (fs.existsSync(filePath)) {
        if(!fs.existsSync(outPath)){
            fs.mkdirSync(path.dirname(outPath), {recursive: true})
        }
        fs.copyFileSync(filePath, outPath)
    }
}

module.exports = { copy }