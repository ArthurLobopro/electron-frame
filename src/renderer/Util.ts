import path from 'path'
import fs from 'fs'

function loadSVG(...PathSegments: string[]) {
    return fs.readFileSync(path.resolve(...PathSegments), { encoding: "utf-8" })
}

function injectCSS(...pathSegments: string[]) {
    const css = document.createElement('link')
    css.rel = "stylesheet"
    css.href = path.resolve(...pathSegments)
    document.head.appendChild(css)
}

function getIconString() {
    const links = Array.from(document.querySelectorAll("link"))
    const iconLink = links.find(link => link.rel.includes('icon'))

    if (iconLink) {
        const image = new Image()
        image.src = iconLink.href
        return `${image.outerHTML}`
    }

    return ''
}

export { loadSVG, getIconString, injectCSS }