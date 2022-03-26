import path from 'path'
import fs from 'fs'

function loadSVG(...PathSegments: string[]) {
    return fs.readFileSync(path.resolve(...PathSegments))
}

function injectCSS(...pathSegments: string[]) {
    const css = document.createElement('link')
    css.rel = "stylesheet"
    css.href = path.resolve(...pathSegments)
    document.head.appendChild(css)
}

function getIconString() {
    const links = document.querySelectorAll("link")
        for (let e of links) {
            if (e.rel.search("icon") !== -1) {
                const image = new Image()
                image.src = e.href
                return `${image.outerHTML}`
            }
        }
        return ''
}

export { loadSVG, getIconString, injectCSS }