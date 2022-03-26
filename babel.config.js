const path = require('path')
const fs = require('fs')

const copyFiles = [
    path.resolve(__dirname, 'src', '@types', 'index.d.ts')
]

copyFiles.forEach( file => {
    const npmDir =  path.resolve(__dirname, "npm")
    const dest = path.resolve(npmDir, path.relative(path.resolve(__dirname,'src'), file))
    console.log(dest);
})

module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current'
                }
            }
        ],
        '@babel/preset-typescript'
    ],
    ignore: ["*.d.ts"]
}