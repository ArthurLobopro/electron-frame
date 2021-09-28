const path = require('path')
const fs = require('fs')

function loadSVG(...PathSegments) {
    return fs.readFileSync(path.resolve(...PathSegments))
}

function injectCSS(...pathSegments) {
    const css = document.createElement('link')
    css.rel = "stylesheet"
    css.href = path.resolve(...pathSegments)
    document.head.appendChild(css)
}

async function getIconString() {
    return new Promise(resolve => {
        const links = document.querySelectorAll("link")
        for (let e of links) {
            if (e.rel.search("icon") !== -1) {
                const windowIcon = document.getElementById("window-icon")
                const image = new Image()
                image.src = e.href
                resolve(`<div id="window-icon">${image.outerHTML}</div>`)
            }
        }
        resolve('')
    })
}

module.exports = { loadSVG, getIconString, injectCSS }